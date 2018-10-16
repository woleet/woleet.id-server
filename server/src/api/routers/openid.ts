import * as Router from 'koa-router';
import { getClient, createOAuthUser, createOAuthSession } from '../../controllers/openid';
import { store as event } from '../../controllers/server-event';

const router = new Router({ prefix: '/oauth' });

const CB_URL = 'https://localhost:4220/oauth/callback';

import { BadRequest } from 'http-errors';
import { Cache } from 'lru-cache';
import * as LRU from 'lru-cache';
import * as v4 from 'uuid/v4';
import { serialiseUserDTO } from '../serialize/userDTO';

const lru: Cache<string, { state: string, nonce: string }> = new LRU({ maxAge: 10 * 1000, max: 1000 });

/**
 * @route: /oauth/login
 */
router.get('/login', async function (ctx) {
  console.log('OAUTH');
  const client = getClient();
  const oauth = v4();
  const state = v4();
  const nonce = v4();
  const url = client.authorizationUrl({
    redirect_uri: CB_URL,
    scope: 'openid profile email',
    state,
    nonce,
    response_type: 'code'
  });
  lru.set(oauth, { state, nonce });
  console.log('url', url);
  ctx.cookies.set('oauth', oauth);
  ctx.redirect(url);
});

/**
 * @route: /oauth/callback
 */
router.get('/callback', async function (ctx) {
  console.log('OAUTH CALLBACK', ctx.query);
  const client = getClient();
  const oauth = ctx.cookies.get('oauth');

  if (!oauth) {
    throw new BadRequest('missing oauth session');
  }

  ctx.cookies.set('oauth', null);
  const oauthSession = lru.get(oauth);

  if (!oauthSession) {
    throw new BadRequest('invalid oauth session');
  }

  console.log(`got ${oauth}=`, oauthSession);

  const { state, nonce } = oauthSession;

  const tokenSet = await client.authorizationCallback(CB_URL, ctx.query, { response_type: 'code', state, nonce }); // => Promise
  console.log('received and validated tokens', tokenSet);
  console.log('validated id_token claims', tokenSet.claims);

  const info = await client.userinfo(tokenSet);
  console.log('USER', info);

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
