import { NotImplemented, BadRequest, Unauthorized } from "http-errors";

import * as Router from "koa-router";


/**
 * Info
 * Request handlers for info.
 * @swagger
 *  tags: [authentication]
 */

const router = new Router();

/**
 * @route: /info
 * @swagger
 *  operationId: getUserInfo
 */
router.get('/info', async function (ctx) {
  throw new NotImplemented();
});

export { router };
