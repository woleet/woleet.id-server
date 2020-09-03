import * as Router from 'koa-router';
import { getUserById } from '../../controllers/user';

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
  ctx.body = await getUserById(ctx.session.userId);
});

export { router };
