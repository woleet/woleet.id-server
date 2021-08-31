import { Issuer } from 'openid-client';
import { createKey } from './key';
import { User } from '../database';
import { store as sessionStore } from './store.session';
import { lookForUser } from './authentication';
import { getServerConfig } from './server-config';
import * as Debug from 'debug';
import * as log from 'loglevel';
import { mapIdentityFromAPIToInternal } from './user';

const debug = Debug('id:ctrl:openid');

let client = null;
let redirectURL = null;

export const getClientRedirectURL = () => redirectURL;

export const getClient = () => client;

async function configure() {
  const config = getServerConfig();

  if (!config.enableOpenIDConnect) {
    debug('Skipping OpenID Connect configuration');
    client = null;
    return;
  }

  if (!config.openIDConnectURL) {
    debug('No openIDConnectURL set, skipping configuration');
    log.warn('No openIDConnectURL set while Open ID Connect is enabled, skipping configuration');
    return;
  }

  if (!config.openIDConnectClientRedirectURL) {
    debug('No openIDConnectClientRedirectURL set, skipping configuration');
    log.warn('No openIDConnectClientRedirectURL set while Open ID Connect is enabled, skipping configuration');
    return;
  }

  redirectURL = config.openIDConnectClientRedirectURL;

  const issuer = await Issuer.discover(config.openIDConnectURL);
  debug('Discovered issuer', issuer.issuer);

  client = new issuer.Client({
    client_id: config.openIDConnectClientId,
    client_secret: config.openIDConnectClientSecret
  });
}

export function initializeOIDC() {
  return configure();
}

export function updateOIDC() {
  return configure();
}

export async function createOAuthUser(user: ApiPostUserObject): Promise<{ token: string, user: InternalUserObject }> {
  const config = getServerConfig();
  if (!config.enableOpenIDConnect) {
    throw new Error('createOAuthUser called while OpenID connect is disabled');
  }
  const identity = mapIdentityFromAPIToInternal(user.identity);
  delete user.identity;

  const newUser = await User.create(Object.assign(identity, user));
  const userId: string = newUser.getDataValue('id');

  const key = await createKey(userId, { name: 'default' });

  newUser.setDataValue('defaultKeyId', key.id);

  await newUser.save();

  const token = await sessionStore.create(newUser);

  return { token, user: newUser.get() };
}

export async function createOAuthSession(email: string): Promise<{ token: string, user: InternalUserObject }> {
  const config = getServerConfig();
  if (!config.enableOpenIDConnect) {
    throw new Error('createOAuthUser called while OpenID connect is disabled');
  }

  const user = await lookForUser(email);
  if (!user) {
    return null;
  }

  const token = await sessionStore.create(user);

  return { token, user: user.get() };
}
