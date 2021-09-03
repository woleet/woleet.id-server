import { User } from '../database';

import * as Debug from 'debug';
import { NotFoundUserError, TokenResetPasswordInvalid } from '../errors';
import { encode } from './utils/password';
import { createKey } from './key';
import { store } from './store.session';
import { FindOptions } from 'sequelize';

const debug = Debug('id:ctr');

async function serializeAndEncodePassword(password: string) {
  const key = await encode(password);
  return {
    passwordHash: key.hash,
    passwordSalt: key.salt,
    passwordItrs: key.iterations
  };
}

/**
 * Map identity format from API to DB.
 */
export function mapIdentityFromAPIToInternal(identity: ApiIdentityObject): InternalIdentityObject {
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

  // Convert identity from API to DB format
  const identity = mapIdentityFromAPIToInternal(user.identity);
  delete user.identity;

  // Encrypt password if provided
  let password;
  if (user.password) {
    password = await serializeAndEncodePassword(user.password);
    delete user.password;
  }

  // Ensure email is lower cased
  if (user.email) {
    user.email = user.email.toLowerCase();
  }

  // Create user
  const newUser = await User.create(Object.assign(identity, user, password));

  // Create user default key if required
  if (user.createDefaultKey) {
    const userId: string = newUser.getDataValue('id');
    const key = await createKey(userId, { name: 'default' });
    newUser.setDataValue('defaultKeyId', key.id);
  }

  // Update and return user
  await newUser.save();
  debug('Created user', newUser.get());
  return newUser.get();
}

export async function updateUser(id: string, attrs: ApiPutUserObject): Promise<InternalUserObject> {
  const update: any = attrs;

  // Check user existence
  const userUpdated = await User.getById(id);
  if (!userUpdated) {
    throw new NotFoundUserError();
  }

  // Encrypt password if provided
  if (attrs.password) {
    const key = await serializeAndEncodePassword(attrs.password);
    delete update.password;
    Object.assign(update, key);
  }

  // Ensure email is lower cased
  if (attrs.email) {
    attrs.email = attrs.email.toLowerCase();
  }

  // Map identity format from API to DB
  if (attrs.identity) {
    const identity = mapIdentityFromAPIToInternal(attrs.identity);
    delete update.identity;
    Object.keys(identity).forEach(key => undefined === identity[key] && delete identity[key]); // delete undefined
    Object.assign(update, identity);
  }

  // Delete all user's sessions if there is a change on his role
  if (attrs.role) {
    await store.delSessionsWithUser(id);
  }

  // Update and return the user
  const user = await User.update(id, update);
  return user.get();
}

export async function getUserById(id: string): Promise<InternalUserObject> {

  // Check user existence
  const user = await User.getById(id);
  if (!user) {
    throw new NotFoundUserError();
  }

  // Return the user
  return user.get();
}

export async function getUsers(opts: FindOptions<any>): Promise<InternalUserObject[]> {
  const users = await User.getAll(opts);
  return users.map((user) => user.get());
}

export async function deleteUser(id: string): Promise<InternalUserObject> {

  // Check user existence
  const user = await User.delete(id);
  if (!user) {
    throw new NotFoundUserError();
  }

  // Delete all user sessions
  await store.delSessionsWithUser(id);

  // Return the user
  return user.get();
}

export async function updatePassword(infoUpdatePassword: ApiResetPasswordObject): Promise<InternalUserObject> {

  // Check user existence
  let user = await User.getByEmail(infoUpdatePassword.email);
  if (!user) {
    throw new NotFoundUserError();
  }

  // Check that password reset token matches the one of the user
  if (infoUpdatePassword.token !== user.get().tokenResetPassword) {
    throw new TokenResetPasswordInvalid();
  }

  // Check that password reset token is not expired
  const timestamp = parseInt(user.get().tokenResetPassword.split('_')[1], 10);
  if ((Date.now() - timestamp) > 0) {
    throw new TokenResetPasswordInvalid();
  }

  // Encrypt the password
  const key = await serializeAndEncodePassword(infoUpdatePassword.password);
  const update = Object.assign({}, {
    tokenResetPassword: null,
    passwordHash: key.passwordHash,
    passwordSalt: key.passwordSalt,
    passwordItrs: key.passwordItrs
  });

  // Update and return the user
  user = await User.update(user.getDataValue('id'), update);
  return user.get();
}
