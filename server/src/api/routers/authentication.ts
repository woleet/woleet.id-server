import { BadRequest, Unauthorized } from 'http-errors';
import * as auth from 'basic-auth';
import * as Router from 'koa-router';
import { createSession, delSession } from '../../controllers/authentication';
import { store as event } from '../../controllers/server-event';
import { cookies } from '../../config';
import { serializeUserDTO } from '../serialize/userDTO';
import { getServerConfig } from '../../controllers/server-config';
import * as querystring from 'querystring';
import { parse } from 'basic-auth';

/**
 * Authentication
 * Request handlers for authentication.
 * @swagger
 *  tags: [authentication]
 */

const router = new Router();

router.post('/login/oidc', async function (ctx) {
  const body = ctx.request.body;
  if (!body.basic) {
    throw new BadRequest();
  }

  const basic = parse('Basic ' + body.basic);
  if (!basic) {
    throw new BadRequest();
  }


  const { name, pass } = basic;
  const authorization = await createSession(name, pass);
  if (!authorization) {
    throw new Unauthorized();
  }

  event.register({
    type: 'login',
    authorizedUserId: authorization.user.id,
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: null,
    data: null
  });
  // ctx.cookies.set('session', authorization.token, cookies.options);

  const returnTo = `${getServerConfig().OIDCPProviderURL}/interaction/${body.grantId}/login?` + querystring.stringify({
    userId: authorization.user.id
  });
  ctx.res.statusCode = 303; // eslint-disable-line no-param-reassign
  ctx.res.setHeader('Location', returnTo);
  ctx.res.setHeader('Content-Length', '0');

  ctx.res.end();
});

/**
 * @route: /login
 * @swagger
 *  operationId: createSession
 */
router.get('/login', async function (ctx) {
  const basic = auth(ctx.req);
  if (!basic) {
    throw new BadRequest();
  }

  const { name, pass } = basic;
  const authorization = await createSession(name, pass);
  if (!authorization) {
    throw new Unauthorized();
  }

  event.register({
    type: 'login',
    authorizedUserId: authorization.user.id,
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: null,
    data: null
  });

  ctx.cookies.set('session', authorization.token, cookies.options);
  ctx.body = { user: serializeUserDTO(authorization.user) };
});

/**
 * @route: /logout
 * @swagger
 *  operationId: logout
 */
router.all('/logout', async function (ctx) {
  if (ctx.session) {
    delSession(ctx.session.id);
  }
  ctx.cookies.set('session', null);

  // Return an empty body
  ctx.body = null;
});

export { router };
