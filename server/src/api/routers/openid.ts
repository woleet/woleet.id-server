import * as Router from 'koa-router';
import { getClient, createOAuthUser, createOAuthSession } from '../../controllers/openid';

const router = new Router({ prefix: '/oauth' });

const CB_URL = 'https://localhost:4220/oauth/callback';

import { BadRequest, ServiceUnavailable } from 'http-errors';
import { Cache } from 'lru-cache';
import * as LRU from 'lru-cache';
import * as v4 from 'uuid/v4';
import { randomBytes } from 'crypto';
import { serialiseUserDTO } from '../serialize/userDTO';
import * as log from 'loglevel';

const lru: Cache<string, { state: string, nonce: string }> = new LRU({ maxAge: 30 * 1000, max: 1000 });

/**
 * @route: /oauth/login
 */
router.get('/login', async function (ctx) {
  const client = getClient();

  if (!client) {
    throw new ServiceUnavailable();
  }

  const oauth = v4();
  const state = v4();
  const nonce = randomBytes(8).toString('hex');
  const url = client.authorizationUrl({
    redirect_uri: CB_URL,
    scope: 'openid profile email',
    state,
    nonce,
    response_type: 'code'
  });
  lru.set(oauth, { state, nonce });
  ctx.cookies.set('oauth', oauth);
  ctx.redirect(url);
});

/**
 * @route: /oauth/callback
 */
router.get('/callback', async function (ctx) {
  const client = getClient();

  if (!client) {
    throw new ServiceUnavailable();
  }

  const oauth = ctx.cookies.get('oauth');

  if (!oauth) {
    throw new BadRequest('missing oauth session');
  }

  ctx.cookies.set('oauth', null);
  const oauthSession = lru.get(oauth);

  if (!oauthSession) {
    throw new BadRequest('invalid oauth session');
  }

  const { state, nonce } = oauthSession;

  let tokenSet;
  try {
    tokenSet = await client.authorizationCallback(CB_URL, ctx.query, { response_type: 'code', state, nonce });
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
    throw new BadRequest('missing "email" response field');
  }

  if (!info.email_verified) {
    throw new BadRequest(info.email_verified === false ? 'Email must be validated' : 'Missing "email_verified" response field');
  }

  if (!info.name) {
    throw new BadRequest('missing "name" response field');
  }

  const session = await createOAuthSession(info.email);

  if (session) {
    ctx.cookies.set('session', session.token);
    return ctx.body = { user: serialiseUserDTO(session.user) };
  } else {
    const aio = await createOAuthUser({ email: info.email, identity: { commonName: info.name } });
    ctx.cookies.set('session', aio.token);
    return ctx.body = { user: serialiseUserDTO(aio.user) };
  }
});

export { router };
