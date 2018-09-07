import { User } from '../database';
import { store as sessionStore } from './store.session';
import { validate } from './utils/password';

export async function createSession(login: string, password: string): Promise<{ token: string, user: InternalUserObject }> {
  let user: SequelizeUserObject = null;

  if (login.search('@') !== -1) {
    user = await User.getByEmail(login);
  } else {
    user = await User.getByUsername(login);
  }

  if (!user) {
    return null;
  }

  // A blocked user cannot login
  if (user.getDataValue('status') === 'blocked') {
    return null;
  }

  if (!user.getDataValue('passwordHash')) {  // step 1: user may have no password
    return null;
  }

  const success = await validate(password, {
    hash: user.getDataValue('passwordHash'),
    salt: user.getDataValue('passwordSalt'),
    iterations: user.getDataValue('passwordItrs')
  });

  if (!success) {
    return null;
  }

  const token = await sessionStore.create(user);

  return { token, user: user.toJSON() };
}

export async function delSession(id: string): Promise<void> {
  return sessionStore.del(id);
}
