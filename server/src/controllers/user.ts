import { User } from '../database';

import * as Debug from 'debug';
import { NotFoundUserError, TokenResetPasswordInvalid } from '../errors';
import { encode } from './utils/password';
import { createKey } from './key';
import { store } from './store.session';

const debug = Debug('id:ctr');
const RESET_PASSWORD_TOKEN_LIFETIME = 1000 * 60 * 30;

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

  if (user.createDefaultKey) {
    const key = await createKey(userId, { name: 'default' });
    debug('Created key', key);
    newUser.setDataValue('defaultKeyId', key.id);
  }

  await newUser.save();

  return newUser.toJSON();
}

export async function updateUser(id: string, attrs: ApiPutUserObject): Promise<InternalUserObject> {
  debug('Update user', id);

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
  debug('Get user', id);

  const user = await User.getById(id);
  if (!user) {
    throw new NotFoundUserError();
  }

  debug('Got user');
  return user.toJSON();
}

export async function getAllUsers(): Promise<InternalUserObject[]> {
  const opt: any = [];
  opt.order = [['x500CommonName']];
  const users = await User.getAll(opt);
  return users.map((user) => user.toJSON());
}

export async function searchAllUsers(search): Promise<InternalUserObject[]> {
  const users = await User.find(search);
  return users.map((user) => user.toJSON());
}

export async function deleteUser(id: string): Promise<InternalUserObject> {
  debug('Deleting user', id);

  const user = await User.delete(id);
  if (!user) {
    throw new NotFoundUserError();
  }

  await store.delSessionsWithUser(id);

  return user.toJSON();
}

export async function updatePassword(infoUpdatePassword: ApiResetPasswordObject): Promise<InternalUserObject> {
  let user = await User.getByEmail(infoUpdatePassword.email);

  if (infoUpdatePassword.token !== user.toJSON().tokenResetPassword) {
    throw new TokenResetPasswordInvalid();
  }

  const timestamp = parseInt(user.toJSON().tokenResetPassword.split('_')[1], 10);

  if ((Date.now() - timestamp) > RESET_PASSWORD_TOKEN_LIFETIME) {
    throw new TokenResetPasswordInvalid();
  }

  const key = await serializeAndEncodePassword(infoUpdatePassword.password);
  const update = Object.assign({}, {
    tokenResetPassword: null, passwordHash: key.passwordHash,
    passwordSalt: key.passwordSalt, passwordItrs: key.passwordItrs
  });

  user = await User.update(user.getDataValue('id'), update);
  if (!user) {
    throw new NotFoundUserError();
  }

  return user.toJSON();
}
