import * as Router from 'koa-router';
import { BadRequest } from 'http-errors';
import { sign } from '../../controllers/sign';
import { validate } from '../schemas';
import { apiTokenAuth } from '../authentication';
import { store as event } from '../../controllers/events';

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

/**
 * @route: /sign
 * @swagger
 *  operationId: getSignature
 */
router.get('/sign', apiTokenAuth, async function (ctx) {
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

  if (!(query.userId || query.customUserId || query.pubKey)) {
    throw new BadRequest('Missign mandatory "userId", "customUserId" or "pubKey" parameter');
  }

  const { signature, pubKey, userId, keyId, signedHash } = await sign(query);

  const identityURL = `${serverBase}/identity?user=${userId}`;

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

});

export { router };
