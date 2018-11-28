import { Issuer } from 'openid-client';
import { serializeIdentity } from './user';
import { createKey } from './key';
import { User } from '../database';
import { store as sessionStore } from './store.session';
import { lookForUser } from './authentication';
import { getServerConfig } from './server-config';
import * as Debug from 'debug';
const debug = Debug('id:ctrl:openid');
import * as log from 'loglevel';

let client = null;
let redirectURL = null;

export const getClientRedirectURL = () => redirectURL;

export const getClient = () => client;

export async function configure() {
  const config = getServerConfig();

  if (!config.useOpenIDConnect) {
    debug('useOpenIDConnect=false, skipping configuration');
    client = null;
    return;
  }

  if (!config.openIDConnectURL) {
    debug('no openIDConnectURL set, skipping configuration');
    log.warn('No openIDConnectURL set while Open ID Connect is enabled, skipping configuration');
    return;
  }

  if (!config.openIDConnectClientRedirectURL) {
    debug('no openIDConnectClientRedirectURL set, skipping configuration');
    log.warn('No openIDConnectClientRedirectURL set while Open ID Connect is enabled, skipping configuration');
    return;
  }

  redirectURL = config.openIDConnectClientRedirectURL;

  const issuer = await Issuer.discover(config.openIDConnectURL);
  debug('Discovered issuer', issuer.issuer);

  client = new issuer.Client({ client_id: config.openIDConnectClientId, client_secret: config.openIDConnectClientSecret });
}

export function updateOIDCClient() {
  return configure();
}

export async function createOAuthUser(user: ApiPostUserObject): Promise<{ token: string, user: InternalUserObject }> {
  const config = getServerConfig();
  if (!config.useOpenIDConnect) {
    throw new Error('createOAuthUser called while openID connect is disabled');
  }
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
  const config = getServerConfig();
  if (!config.useOpenIDConnect) {
    throw new Error('createOAuthUser called while openID connect is disabled');
  }
  const user = await lookForUser(email);

  if (!user) {
    return null;
  }

  const token = await sessionStore.create(user);

  return { token, user: user.toJSON() };
}
