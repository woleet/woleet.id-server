import * as Router from 'koa-router';
import { createOAuthSession, createOAuthUser, getClient, getClientRedirectURL } from '../../controllers/openid';
import { BadRequest, ServiceUnavailable } from 'http-errors';
import * as LRU from 'lru-cache';
import { Cache } from 'lru-cache';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import { getUserById } from '../../controllers/user';
import * as log from 'loglevel';
import { cookies } from '../../config';
import { updateUser } from '../../controllers/user';
import { serializeUserDTO } from '../serialize/userDTO';

const router = new Router({ prefix: '/oauth' });

const lru: Cache<string, { state: string, nonce: string }> = new LRU({ maxAge: 90 * 1000, max: 1000 });

/**
 * @route: /oauth/login
 */
router.get('/login', async function (ctx) {
  const client = getClient();

  if (!client) {
    throw new ServiceUnavailable();
  }

  const oauth = uuidv4();
  const state = uuidv4();
  const nonce = randomBytes(8).toString('hex');
  const url = client.authorizationUrl({
    redirect_uri: getClientRedirectURL() /* TODO: check arg */,
    scope: 'openid profile email',
    response_type: 'code',
    state,
    nonce
  });

  lru.set(oauth, { state, nonce });
  ctx.cookies.set('oauth', oauth, cookies.options);
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
    throw new BadRequest('Missing OAuth session');
  }

  ctx.cookies.set('oauth', null);
  const oauthSession = lru.get(oauth);

  if (!oauthSession) {
    throw new BadRequest('Invalid OAuth session');
  }

  const { state, nonce } = oauthSession;

  let tokenSet;
  try {
    tokenSet = await client.callback(
      getClientRedirectURL() /* TODO: check arg */,
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
      await updateUser(user.id, { identity: { commonName: info.name } });
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

  return ctx.body = { user: serializeUserDTO(await getUserById(session.user.id)) };
});

export { router };
