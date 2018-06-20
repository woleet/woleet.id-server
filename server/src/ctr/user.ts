import { ApiPostUserObject, InternalUserObject, ApiPutUserObject } from '../typings';

import { db } from '../db'

import * as Debug from 'debug';
const debug = Debug('id:ctr');

export async function createUser(user: ApiPostUserObject): Promise<InternalUserObject> {
  debug('Create user');

  const newUser = await db.user.create(user);

  debug('Created user', newUser);
  return newUser.toJSON();
}

export async function updateUser(id: string, attrs: ApiPutUserObject): Promise<InternalUserObject | null> {
  debug('Update user', attrs);

  const user = await db.user.update(id, attrs);

  debug('Updated user');
  return user && user.toJSON();
}

export async function getUserById(id: string): Promise<InternalUserObject | null> {
  debug('Get user' + id);

  const user = await db.user.getById(id);

  debug('Got user');
  return user && user.toJSON();
}
