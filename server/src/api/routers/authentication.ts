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
  console.log(basic);

  if (!basic)
    throw new BadRequest();

  const { name, pass } = basic;
  const token = await createSession(name, pass);

  if (!token)
    throw new Unauthorized();

  ctx.body = { token };
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
