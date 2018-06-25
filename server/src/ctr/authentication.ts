import { db } from '../db';
import { store as sessionStore } from './session';
import { validate } from './utils/password';
import { SequelizeUserObject } from '../typings';

export async function createSession(login: string, password: string): Promise<string> {
  let user: SequelizeUserObject = null;
  if (login.search('@') != -1) {
    user = await db.user.getByEmail(login);
  } else {
    user = await db.user.getByUsername(login);
  }

  if (!user)
    return null;

  const success = await validate(password, {
    hash: user.getDataValue('password_hash'),
    salt: user.getDataValue('password_salt'),
    iterations: user.getDataValue('password_itrs'),
  })

  if (!success)
    return null;

  return sessionStore.create(user);
}

export async function delSession(id: string): Promise<void> {
  return sessionStore.del(id);
}
