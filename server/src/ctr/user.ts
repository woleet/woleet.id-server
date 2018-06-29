import { db } from '../db';

import * as Debug from 'debug';
import { NotFoundUserError } from '../errors';
import { encode } from './utils/password';
const debug = Debug('id:ctr');

export async function createUser(user: ApiPostUserObject): Promise<InternalUserObject> {
  debug('Create user');

  const key = await encode(user.password);

  delete user.password;

  const newUser = await db.User.create(Object.assign({}, user, {
    passwordHash: key.hash,
    passwordSalt: key.salt,
    passwordItrs: key.iterations
  }));

  debug('Created user', newUser);
  return newUser.toJSON();
}

export async function updateUser(id: string, attrs: ApiPutUserObject): Promise<InternalUserObject> {
  debug('Update user', attrs);

  if (attrs.password) {
    const key = await encode(attrs.password);

    delete attrs.password;

    Object.assign(attrs, {
      passwordHash: key.hash,
      passwordSalt: key.salt,
      passwordItrs: key.iterations
    });
  }

  const user = await db.User.update(id, attrs);

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
