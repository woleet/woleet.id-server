import { User } from '../database';
import { store as sessionStore } from './store.session';
import { validate } from './utils/password';

export function lookForUser(login: string): Promise<SequelizeUserObject> {
  if (login.search('@') !== -1) {
    return User.getByEmail(login);
  } else {
    return User.getByUsername(login);
  }
}

export async function createSession(login: string, password: string)
  : Promise<{ token: string, user: InternalUserObject }> {
  const user = await lookForUser(login);
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

  user.set('lastLogin', new Date);

  await user.save();

  return { token, user: user.toJSON() };
}

export async function createOAuthSession(user): Promise<{ token: string, user: InternalUserObject }> {
  if (!user) {
    return null;
  }

  // A blocked user cannot login
  if (user.getDataValue('status') === 'blocked') {
    return null;
  }

  const token = await sessionStore.create(user);

  user.set('lastLogin', new Date);

  await user.save();

  return { token, user: user.toJSON() };
}

export async function delSession(id: string): Promise<void> {
  return sessionStore.del(id);
}
