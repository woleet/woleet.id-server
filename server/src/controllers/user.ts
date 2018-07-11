import { db } from '../database';

import * as Debug from 'debug';
import { NotFoundUserError } from '../errors';
import { encode } from './utils/password';
const debug = Debug('id:ctr');

async function serializeAndEncodePassword(password: string) {
  const key = await encode(password);

  return {
    passwordHash: key.hash,
    passwordSalt: key.salt,
    passwordItrs: key.iterations
  }
}

function serializeIdentity(identity: APIIdentityObject): InternalIdentityObject {
  return {
    x500CommonName: identity.commonName,
    x500Organization: identity.organization,
    x500OrganizationalUnit: identity.organizationalUnit,
    x500Locality: identity.locality,
    x500Country: identity.country,
    x500UserId: identity.userId
  }
}

export async function createUser(user: ApiPostUserObject): Promise<InternalUserObject> {
  debug('Create user');

  const identity = serializeIdentity(user.identity);
  delete user.identity;
  const key = await serializeAndEncodePassword(user.password);
  delete user.password;

  const newUser = await db.User.create(Object.assign(identity, user, key));

  debug('Created user', newUser);
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

  const user = await db.User.update(id, update);

  if (!user)
    throw new NotFoundUserError();

  debug('Updated user');
  return user.toJSON();
}

export async function getUserById(id: string): Promise<InternalUserObject> {
  debug('Get user' + id);

  const user = await db.User.getById(id);

  if (!user)
    throw new NotFoundUserError();

  debug('Got user');
  return user.toJSON();
}

export async function getAllUsers(): Promise<InternalUserObject[]> {
  const users = await db.User.getAll();
  return users.map((user) => user.toJSON());
}
