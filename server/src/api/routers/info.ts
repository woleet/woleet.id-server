import * as Router from 'koa-router';
import { getUserById } from '../../controllers/user';
import { serializeUserDTO } from '../serialize/userDTO';
import { BadRequest } from 'http-errors';

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
  if (!ctx.authorizedUser) {
    throw new BadRequest('Cannot get user info with an admin token');
  }
  ctx.body = serializeUserDTO(await getUserById(ctx.authorizedUser.userId));
});

export { router };
