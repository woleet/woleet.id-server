import { db } from '../db';
import { store as sessionStore } from './session';
import { validate } from './utils/password';

export async function createSession(login: string, password: string): Promise<AuthResponseObject> {
  let user: SequelizeUserObject = null;
  if (login.search('@') != -1) {
    user = await db.User.getByEmail(login);
  } else {
    user = await db.User.getByUsername(login);
  }

  if (!user)
    return null;

  const success = await validate(password, {
    hash: user.getDataValue('passwordHash'),
    salt: user.getDataValue('passwordSalt'),
    iterations: user.getDataValue('passwordItrs'),
  })

  if (!success)
    return null;

  const token = await sessionStore.create(user);

  const admin = 'admin' === user.getDataValue('username')

  return { token, admin }
}

export async function delSession(id: string): Promise<void> {
  return sessionStore.del(id);
}
