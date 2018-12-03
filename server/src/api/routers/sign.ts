import * as Router from 'koa-router';
import { BadRequest, Unauthorized } from 'http-errors';
import { sign } from '../../controllers/sign';
import { validate } from '../schemas';
import { bearerAuth } from '../authentication';
import { store as event } from '../../controllers/server-event';

import { getServerConfig } from '../../controllers/server-config';

const vuuid = validate.raw('uuid');
const vhash = validate.raw('sha256');
const vaddr = validate.raw('address');

/**
 * Signature
 * Request handlers for signature.
 * @swagger
 *  tags: [signature]
 */

const router = new Router();

const signMiddleware: Router.IMiddleware[] = [
  bearerAuth,
  async function (ctx) {
    const query = ctx.query;
    const token = ctx.token;

    if (!query.hashToSign) {
      throw new BadRequest('Missign mandatory "hashToSign" query parameter');
    }

    if (!(await vhash(query.hashToSign))) {
      throw new BadRequest('Query parameter "hashToSign" must be a SHA256 hash (in lowercase)');
    }

    if (query.userId && !(await vuuid(query.userId))) {
      throw new BadRequest('Invalid query parameter "userId"');
    }

    if (token.role !== 'admin' && query.userId && token.userId !== query.userId) {
      throw new Unauthorized(`Cannot sign for user ${query.userId} with these credentials`);
    }

    if (query.pubKey && !(await vaddr(query.pubKey))) {
      throw new BadRequest('Invalid query parameter "pubKey"');
    }

    const { signature, pubKey, userId, keyId, signedHash } = await sign(Object.assign({}, query, { userId: token.userId }));

    const identityURL = getServerConfig().identityURL;

    event.register({
      type: 'signature',
      authorizedUserId: ctx.token.userId,
      authorizedTokenId: ctx.token.type === 'api' ? ctx.token.id : null,
      associatedTokenId: null,
      associatedUserId: userId,
      associatedKeyId: keyId,
      data: { hash: signedHash, auth: ctx.token.type }
    });

    ctx.body = { pubKey, signedHash, signature, identityURL };
  }
];

/**
 * @route: /sign
 * @swagger
 *  operationId: getSignature
 */
router.get('/sign', ...signMiddleware);

/**
 * Backward compatibility with woleet backend-kit
 * @route: /signature
 * @swagger
 *  operationId: getSignature
 */
router.get('/signature', ...signMiddleware);

export { router };
