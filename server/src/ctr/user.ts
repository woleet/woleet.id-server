import { UserObject } from '../typings';

import { db } from '../db'

import * as Debug from 'debug';
const debug = Debug('id:ctr:user');

function createUser(user: UserObject) {
  debug('Create user', user);
  return db.createUser(user);
}

export { createUser };
