import * as Router from 'koa-router';
import { BadRequest } from 'http-errors';
import { sign } from '../../controllers/sign';
import { validate } from '../schemas';
import { apiTokenAuth } from '../authentication';
import { store as event } from '../../controllers/server-event';

import { server } from '../../config';

const serverBase = server.protocol + '://' + server.host;

const vuuid = validate.raw('uuid');
const vaddr = validate.raw('address');

/**
 * Signature
 * Request handlers for signature.
 * @swagger
 *  tags: [signature]
 */

const router = new Router();

const signMiddleware: Router.IMiddleware[] = [
  apiTokenAuth,
  async function (ctx) {
    const query = ctx.query;

    if (!query.hashToSign) {
      throw new BadRequest('Missign mandatory "hashToSign" parameter');
    }

    if (query.userId && !(await vuuid(query.userId))) {
      throw new BadRequest('Invalid "userId"');
    }

    if (query.pubKey && !(await vaddr(query.pubKey))) {
      throw new BadRequest('Invalid "pubKey"');
    }

    const { signature, pubKey, userId, keyId, signedHash } = await sign(query);

    const identityURL = `${serverBase}/identity`;

    event.register({
      type: 'signature',
      authorizedUserId: null,
      authorizedTokenId: ctx.apiToken.id,
      associatedTokenId: null,
      associatedUserId: userId,
      associatedKeyId: keyId,
      data: { hash: signedHash }
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
