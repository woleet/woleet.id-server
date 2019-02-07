import { User } from '../database';

import * as Debug from 'debug';
import { NotFoundUserError, TokenResetPasswordInvalid } from '../errors';
import { encode } from './utils/password';
import { createKey } from './key';
import { store } from './store.session';
import * as uuidV4 from 'uuid/v4';

// move to serverConfig after
import * as nodemailer from 'nodemailer';

const debug = Debug('id:ctr');

async function serializeAndEncodePassword(password: string) {
  const key = await encode(password);

  return {
    passwordHash: key.hash,
    passwordSalt: key.salt,
    passwordItrs: key.iterations
  };
}

export function serializeIdentity(identity: ApiIdentityObject): InternalIdentityObject {
  return {
    x500CommonName: identity.commonName,
    x500Organization: identity.organization,
    x500OrganizationalUnit: identity.organizationalUnit,
    x500Locality: identity.locality,
    x500Country: identity.country,
    x500UserId: identity.userId
  };
}

export async function createUser(user: ApiPostUserObject): Promise<InternalUserObject> {
  debug('Create user');

  const identity = serializeIdentity(user.identity);
  delete user.identity;

  // step 1: user may have no password
  let password;
  if (user.password) {
    password = await serializeAndEncodePassword(user.password);
    delete user.password;
  }
  const newUser = await User.create(Object.assign(identity, user, password));
  const userId: string = newUser.getDataValue('id');

  debug('Created user', newUser.toJSON());

  const key = await createKey(userId, { name: 'default' });

  debug('Created key', key);

  newUser.setDataValue('defaultKeyId', key.id);

  await newUser.save();

  return newUser.toJSON();
}

export async function updateUser(id: string, attrs: ApiPutUserObject): Promise<InternalUserObject> {
  debug('Update user', attrs);

  const update = Object.assign({}, attrs);

  if (attrs.password) {
    const key = await serializeAndEncodePassword(attrs.password);
    delete update.password;

    Object.assign(update, key);
  }

  if (attrs.identity) {
    const identity = serializeIdentity(attrs.identity);
    delete update.identity;

    // delete undefined properties
    Object.keys(identity).forEach(key => undefined === identity[key] && delete identity[key]);

    Object.assign(update, identity);
  }

  // flush session(s) associted to a user if there is a change on his role
  if (attrs.role) {
    await store.delSessionsWithUser(id);
  }

  const user = await User.update(id, update);

  if (!user) {
    throw new NotFoundUserError();
  }

  debug('Updated user');
  return user.toJSON();
}

export async function getUserById(id: string): Promise<InternalUserObject> {
  debug('Get user' + id);

  const user = await User.getById(id);

  if (!user) {
    throw new NotFoundUserError();
  }

  debug('Got user');
  return user.toJSON();
}

export async function getAllUsers(): Promise<InternalUserObject[]> {
  const users = await User.getAll();
  return users.map((user) => user.toJSON());
}

export async function searchAllUsers(search): Promise<InternalUserObject[]> {
  const users = await User.find(search);
  return users.map((user) => user.toJSON());
}

export async function deleteUser(id: string): Promise<InternalUserObject> {
  debug('Deleting user' + id);

  const user = await User.delete(id);

  await store.delSessionsWithUser(id);

  if (!user) {
    throw new NotFoundUserError();
  }

  return user.toJSON();
}

export async function updatePassword(infoUpdatePassword: ApiResetPasswordObject): Promise<InternalUserObject> {
  let user = await User.getByEmail(infoUpdatePassword.email);

  if (infoUpdatePassword.token !== user.toJSON().tokenResetPassword) {
    throw new TokenResetPasswordInvalid();
  }

  const key = await serializeAndEncodePassword(infoUpdatePassword.password);
  const update = Object.assign({}, {tokenResetPassword: null, passwordHash: key.passwordHash,
    passwordSalt: key.passwordSalt, passwordItrs: key.passwordItrs });

    user = await User.update(user.getDataValue('id'), update);

    if (!user) {
      throw new NotFoundUserError();
    }

    return user.toJSON();
  }

  export async function sendEmail(email: string): Promise<InternalUserObject> {
    let user = await User.getByEmail(email);

    if (!user) {
      throw new NotFoundUserError();
    }

    const token = uuidV4();

    const update = Object.assign({}, {tokenResetPassword: token});

    user = await User.update(user.getDataValue('id'), update);

    // with ethereal. Catch the email with the url sent in the console.

    // const account = await nodemailer.createTestAccount();

    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.ethereal.email',
    //   port: 587,
    //   secure: false,
    //   tls: {
    //     // do not fail on invalid certs
    //     rejectUnauthorized: false
    //   },
    //   auth: {
    //     user: account.user, // generated ethereal user
    //     pass: account.pass  // generated ethereal password
    //   }
    // });

    // with sendgrid

    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: ''''
      }
    });

    transporter.verify(function(error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log('Server is ready to take our messages');
      }
    });

    const link = 'https://localhost:4220/reset-password?token=' +
    token + '&email=' + email;

    await transporter.sendMail(MailTemplate(link, email), function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
    });
    return user.toJSON();
  }

  function MailTemplate(link: string, email: string): object {
    return {
      from: 'Woleet no-reply@woleet.com',
      to: email,
      subject: 'Password recovery',
      text: 'Your reset link: ' + link,
    };
  }
