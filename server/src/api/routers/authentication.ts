import { BadRequest, Unauthorized } from "http-errors";

import * as auth from "basic-auth";
import * as Router from "koa-router";

import { createSession, delSession } from "../../ctr/authentication";

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

  if (!basic)
    throw new BadRequest();

  const { name, pass } = basic;
  const authorization: AuthResponseObject = await createSession(name, pass);

  if (!auth)
    throw new Unauthorized();

  ctx.body = authorization;
});

/**
 * @route: /logout
 * @swagger
 *  operationId: logout
 */
router.all('/logout', async function (ctx) {
  await delSession(ctx.session.id);
  ctx.body = '';
});

export { router };
