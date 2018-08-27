import * as Router from 'koa-router';
import { serialiseUserDTO } from '../serialize/userDTO';


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
  ctx.body = serialiseUserDTO(ctx.session.user.toJSON());
});

export { router };
