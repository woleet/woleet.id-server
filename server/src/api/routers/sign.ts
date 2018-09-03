import * as Router from 'koa-router';
import { BadRequest } from 'http-errors';
import { sign } from '../../controllers/sign';
import { validate } from '../schemas';

const vuuid = validate.raw('uuid');
const vaddr = validate.raw('address');

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

  if (!hashToSign) {
    throw new BadRequest('Missign mandatory "hashToSign" parameter');
  }

  if (userId && !(await vuuid(userId))) {
    throw new BadRequest('Invalid "userId"');
  }

  if (pubKey && !(await vaddr(pubKey))) {
    throw new BadRequest('Invalid "pubKey"');
  }

  if (!(userId || customUserId || pubKey)) {
    throw new BadRequest('Missign mandatory "userId", "customUserId" or "pubKey" parameter');
  }

  ctx.body = await sign(hashToSign, pubKey, userId, customUserId);
});

export { router };
