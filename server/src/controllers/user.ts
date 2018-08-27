import { User, Key } from '../database';

import * as Debug from 'debug';
import { NotFoundUserError } from '../errors';
import { encode } from './utils/password';
import { createKey } from './key';
const debug = Debug('id:ctr');

async function serializeAndEncodePassword(password: string) {
  const key = await encode(password);

  return {
    passwordHash: key.hash,
    passwordSalt: key.salt,
    passwordItrs: key.iterations
  };
}

function serializeIdentity(identity: APIIdentityObject): InternalIdentityObject {
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

  debug('Created user\'s default key', key);
  newUser.setDataValue('defaultKeyId', key.id);

  const newUserWithDefaultKey = await newUser.save();

  debug('Created user\'s with key', newUserWithDefaultKey.toJSON());
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

  debug('Updating', update);

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

export async function deleteUser(id: string): Promise<InternalUserObject> {
  debug('Del user' + id);

  const user = await User.delete(id);

  if (!user) {
    throw new NotFoundUserError();
  }

  debug('Deleted user');
  return user.toJSON();
}
