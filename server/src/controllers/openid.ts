import { Issuer } from 'openid-client';
import { serializeIdentity } from './user';
import { createKey } from './key';
import { User } from '../database';
import { store as sessionStore } from './store.session';
import { lookForUser } from './authentication';

let _client = null;

export const getClient = () => _client;

export function initOpenid() {
  return Issuer.discover('https://keycloak.woleet.io:8443/auth/realms/sso-test')
    .then((issuer) => {
      console.log('Discovered issuer', issuer.issuer);
      console.log('Issuer has', issuer.metadata);
      return issuer;
    })
    .then((issuer) => {
      console.log('Creating client...');
      _client = new issuer.Client({
        client_id: 'test-openid',
        client_secret: '7451240a-a19e-4e00-b35f-4595bd55e327'
      });
      console.log('Created', _client);
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function createOAuthUser(user: ApiPostUserObject): Promise<{ token: string, user: InternalUserObject }> {
  const identity = serializeIdentity(user.identity);
  delete user.identity;

  const newUser = await User.create(Object.assign(identity, user));
  const userId: string = newUser.getDataValue('id');

  const key = await createKey(userId, { name: 'default' });

  newUser.setDataValue('defaultKeyId', key.id);

  await newUser.save();

  const token = await sessionStore.create(newUser);

  return { token, user: newUser.toJSON() };
}

export async function createOAuthSession(email: string): Promise<{ token: string, user: InternalUserObject }> {
  const user = await lookForUser(email);

  if (!user) {
    return null;
  }

  const token = await sessionStore.create(user);

  return { token, user: user.toJSON() };
}
