import * as Router from "koa-router";
import { BadRequest } from 'http-errors';
import { sign } from "../../controllers/sign";
import { validate } from '../schemas';

const vuuid = validate.raw('uuid');

/**
 * Signature
 * Request handlers for signature.
 * @swagger
 *  tags: [signature]
 */

const router = new Router();

/**
 * @route: /sign
 * @swagger
 *  operationId: getSignature
 */
router.get('/sign', async function (ctx) {
  const { hashToSign, pubKey, userId, customUserId } = ctx.query;

  console.log('query = ', { hashToSign, pubKey, userId, customUserId })

  if (!hashToSign)
    throw new BadRequest('Missign mandatory "hashToSign" parameter')

  if (userId && !(await vuuid(userId)))
    throw new BadRequest('Invalid "userId"');

  if (!(userId || customUserId))
    throw new BadRequest('Missign mandatory "userId" or "customUserId" parameter')

  ctx.body = await sign(hashToSign, pubKey, userId, customUserId);
});

export { router };
