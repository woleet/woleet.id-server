import * as Debug from 'debug';
import * as log from 'loglevel';
import { Issuer } from 'openid-client';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import { BadRequest, ServiceUnavailable } from 'http-errors';
import { createKey } from './key';
import { mapIdentityFromAPIToInternal } from './user';
import { lookForUser } from './authentication';
import { getServerConfig } from './server-config';
import { InternalUserObject } from '../types';
import { cookies } from '../config';
import { User } from '../database';
import { updateUser } from '../controllers/user';
import { store as sessionStore } from './store.session';
import { oauthLoginCache } from './store.oauth-login-cache';

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
    log.warn('No openIDConnectURL set while OpenID Connect is enabled, skipping configuration');
    return;
  }

  if (!config.openIDConnectClientRedirectURL) {
    debug('No openIDConnectClientRedirectURL set, skipping configuration');
    log.warn('No openIDConnectClientRedirectURL set while OpenID Connect is enabled, skipping configuration');
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

  const returnedUser = newUser.get();
  const token = await sessionStore.create(returnedUser);

  return { token, user: returnedUser };
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

  const returnedUser = user.get();
  const token = await sessionStore.create(returnedUser);

  return { token, user: returnedUser };
}

export async function oauthLoginEndpoint(ctx, redirectURL = getClientRedirectURL(), interaction = '') {
  const client = getClient();

  if (!client) {
    throw new ServiceUnavailable();
  }

  const oauth = uuidv4();
  const state = uuidv4();
  const nonce = randomBytes(8).toString('hex');
  const url = client.authorizationUrl({
    redirect_uri: redirectURL /* TODO: check arg */,
    scope: 'openid profile email',
    response_type: 'code',
    state,
    nonce
  });

  await oauthLoginCache.set(oauth, { state, nonce, interaction });
  ctx.cookies.set('openidserv', oauth, cookies.options);
  ctx.redirect(url);
}

type CallbackOutput = {
  userId: string;
  interaction: string;
};

export async function oauthCallbackEndpoint(ctx, redirectURL = getClientRedirectURL()):Promise<CallbackOutput> {
  const client = getClient();

  if (!client) {
    throw new ServiceUnavailable();
  }

  const oauth = ctx.cookies.get('openidserv');

  if (!oauth) {
    throw new BadRequest('Missing OAuth session');
  }

  ctx.cookies.set('openidserv', null);
  const oauthSession = await oauthLoginCache.get(oauth);

  if (!oauthSession) {
    throw new BadRequest('Invalid OAuth session');
  }

  const { state, nonce, interaction } = oauthSession;

  let tokenSet;
  try {
    tokenSet = await client.callback(
      redirectURL /* TODO: check arg */,
      ctx.query,
      { response_type: 'code', state, nonce }
    );
  } catch (err) {
    log.warn(err);
    throw new BadRequest(err.message);
  }

  let info;
  try {
    info = await client.userinfo(tokenSet);
  } catch (err) {
    log.warn(err);
    throw new BadRequest(err.message);
  }

  if (!info.email) {
    throw new BadRequest('Missing "email" response field');
  }

  if (!info.email_verified) {
    throw new BadRequest(info.email_verified === false ? 'Email must be verified' : 'Missing "email_verified" response field');
  }

  if (!info.name) {
    throw new BadRequest('Missing "name" response field');
  }

  let session = await createOAuthSession(info.email);

  if (session) {
    ctx.cookies.set('session', session.token, cookies.options);

    if (session.user.x500CommonName !== info.name) {
      const user = session.user;
      await updateUser(user.id, { identity: { commonName: info.name } }, null);
      user.x500CommonName = info.name;
    }
  } else {
    session = await createOAuthUser({
      email: info.email, mode: 'esign',
      identity: { commonName: info.name },
      createDefaultKey: true,
      sendKeyEnrollmentMail: false
    });
    ctx.cookies.set('session', session.token, cookies.options);
  }

  return {'userId': session.user.id, 'interaction': interaction};
}
