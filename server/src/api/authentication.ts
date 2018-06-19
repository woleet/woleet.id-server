import { NotImplemented } from "http-errors";

import * as Router from "koa-router";

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
 *  operationId: login
 */
router.get('/login', async function (ctx) {
  throw new NotImplemented();
});

/**
 * @route: /info
 * @swagger
 *  operationId: getUserInfo
 */
router.get('/info', async function (ctx) {
  throw new NotImplemented();
});

/**
 * @route: /logout
 * @swagger
 *  operationId: logout
 */
router.all('/logout', function (ctx) {
  throw new NotImplemented();
});

export { router };
