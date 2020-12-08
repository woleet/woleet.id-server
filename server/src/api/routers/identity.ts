import * as Router from 'koa-router';
import { BadRequest } from 'http-errors';
import { getIdentity } from '../../controllers/identity';
import { validate } from '../schemas';
import { getServerConfig } from '../../controllers/server-config';

const vaddr = validate.raw('address');

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
  const { pubKey, leftData, signedIdentity } = ctx.query;

  if (!pubKey) {
    throw new BadRequest('Missing "pubKey" parameter');
  }

  if (!(await vaddr(pubKey))) {
    throw new BadRequest('Invalid "pubKey" parameter');
  }

  if (getServerConfig().preventIdentityExposition && !signedIdentity) {
    throw new BadRequest('Missing "signedIdentity" parameter');
  }

  ctx.body = await getIdentity(leftData, pubKey, signedIdentity);
});

export { router };
