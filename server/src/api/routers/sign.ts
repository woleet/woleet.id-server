import * as Router from 'koa-router';
import { BadRequest, Unauthorized } from 'http-errors';
import { sign } from '../../controllers/sign';
import { validate } from '../schemas';
import { bearerAuth } from '../authentication';
import { store as event } from '../../controllers/server-event';

import { getServerConfig } from '../../controllers/server-config';
import { Context } from 'koa';
import { getUserById } from '../../controllers/user';

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

async function getSignature(ctx: Context) {
  const query = ctx.query;
  const token = ctx.token;

  if (!query.hashToSign) {
    throw new BadRequest('Missing mandatory "hashToSign" query parameter');
  }

  if (!(await vhash(query.hashToSign))) {
    throw new BadRequest('Query parameter "hashToSign" must be a SHA256 hash (in lowercase)');
  }

  if (query.userId && !(await vuuid(query.userId))) {
    throw new BadRequest('Invalid query parameter "userId"');
  }

  if (query.userId && token.userId && (token.userId !== query.userId)) {
    throw new Unauthorized('Cannot sign for another user.');
  }

  if (query.pubKey && !(await vaddr(query.pubKey))) {
    throw new BadRequest('Invalid query parameter "pubKey"');
  }

  let _userId = null;
  if (token.userId) {
    _userId = token.userId;
  } else if (query.userId) {
    _userId = query.userId;
    const user = await getUserById(_userId);
    if (user.mode === 'esign') {
      throw new Unauthorized('Cannot use e-signature with an admin token.');
    }
  }

  const { signature, pubKey, userId, keyId, signedHash } = await sign(Object.assign({}, query, { userId: _userId }));

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

/**
 * @route: /sign
 * @swagger
 *  operationId: getSignature
 */
router.get('/sign', bearerAuth, getSignature);

/**
 * Backward compatibility with woleet backend-kit
 * @route: /signature
 * @swagger
 *  operationId: getSignature
 */
router.get('/signature', bearerAuth, getSignature);

export { router };
