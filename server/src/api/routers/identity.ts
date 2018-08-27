import * as Router from 'koa-router';
import { BadRequest } from 'http-errors';
import { getIdentity } from '../../controllers/indetity';


/**
 * Identity
 * Request handlers for identity.
 * @swagger
 *  tags: [identity]
 */

const router = new Router();

/**
 * @route: /identity
 * @swagger
 *  operationId: getIdentity
 */
router.get('/identity', async function (ctx) {
  const { pubKey, leftData } = ctx.query;

  if (!pubKey) {
    throw new BadRequest('Missing mandatory "pubKey" parameter');
  }

  if (!leftData) {
    throw new BadRequest('Missing mandatory "leftData" parameter');
  }

  ctx.body = await getIdentity(leftData, pubKey);
});

export { router };
