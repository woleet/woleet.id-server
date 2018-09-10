import { BadRequest, Unauthorized } from 'http-errors';

import * as auth from 'basic-auth';
import * as Router from 'koa-router';

import { createSession, delSession } from '../../controllers/authentication';
import { serialiseUserDTO } from '../serialize/userDTO';
import { store as event } from '../../controllers/events';

/**
 * Authentification
 * Request handlers for authentication.
 * @swagger
 *  tags: [authentication]
 */

const router = new Router();

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

  ctx.cookies.set('session', authorization.token);
  ctx.body = { user: serialiseUserDTO(authorization.user) };
});

/**
 * @route: /logout
 * @swagger
 *  operationId: logout
 */
router.all('/logout', async function (ctx) {
  if (ctx.session) {
    await delSession(ctx.session.id);
  }
  ctx.cookies.set('session', null);
  ctx.body = '';
});

export { router };
