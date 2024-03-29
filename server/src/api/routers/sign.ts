import * as Router from 'koa-router';
import { BadRequest, Unauthorized } from 'http-errors';
import { sign } from '../../controllers/sign';
import { validate } from '../schemas';
import { bearerAuth } from '../authentication';
import { serverEventLogger } from '../../config';
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

async function getSignature(ctx) {
  const query = ctx.query;
  const token = ctx.token;

  if (!query.messageToSign && !query.hashToSign) {
    throw new BadRequest('Missing mandatory "messageToSign" or "hashToSign" query parameter');
  }

  if (query.hashToSign && !(await vhash(query.hashToSign))) {
    throw new BadRequest('Query parameter "hashToSign" must be a SHA256 hash (in lowercase)');
  }

  if (query.userId && !(await vuuid(query.userId))) {
    throw new BadRequest('Invalid query parameter "userId"');
  }

  if (query.userId && token.userId && token.userId !== query.userId) {
    throw new Unauthorized('Cannot sign for another user');
  }

  if (query.pubKey && !(await vaddr(query.pubKey))) {
    throw new BadRequest('Invalid query parameter "pubKey"');
  }

  if (query.identityToSign && !query.identityToSign.match(/^(ALL|((CN|O|OU|L|C|EMAILADDRESS),?)+)$/g)) {
    throw new BadRequest('Invalid query parameter "identityToSign"');
  }

  // When authenticated using a user token, a user can only sign for himself
  let _userId = null;
  if (token.userId) {
    _userId = token.userId;
  }

  // When authenticated using an admin token, an admin can only sign for seal users
  else if (query.userId) {
    _userId = query.userId;
    const user = await getUserById(_userId);
    if (user.mode === 'esign') {
      throw new Unauthorized('Cannot use e-signature with an admin token');
    }
  }

  const { signature, pubKey, userId, keyId, signedMessage, signedHash, signedIdentity, signedIssuerDomain } =
    await sign(Object.assign({}, query, { userId: _userId }));

  const identityURL = getServerConfig().identityURL;

  serverEventLogger.info({
    type: 'signature',
    authorizedUserId: ctx.token.userId,
    authorizedTokenId: ctx.token.type === 'api' ? ctx.token.id : null,
    associatedTokenId: null,
    associatedUserId: userId,
    associatedKeyId: keyId,
    data: { hash: signedHash, auth: ctx.token.type }
  });

  const body: {[k: string]: any} = {};
  if (pubKey) {
    body.pubKey = pubKey;
  }
  if (signedMessage) {
    body.signedMessage = signedMessage;
  }
  if (signedHash) {
    body.signedHash = signedHash;
  }
  if (signature) {
    body.signature = signature;
  }
  if (identityURL) {
    body.identityURL = identityURL;
  }
  if (signedIdentity) {
    body.signedIdentity = signedIdentity;
  }
  if (signedIssuerDomain) {
    body.signedIssuerDomain = signedIssuerDomain;
  }
  ctx.body = body;
}

/**
 * @route: /sign
 * @swagger
 *  operationId: getSignature
 */
router.get('/sign', bearerAuth, getSignature);

/**
 * @route: /signature
 * @deprecated For backward compatibility with woleet backend-kit
 * @swagger
 *  operationId: getSignature
 */
router.get('/signature', bearerAuth, getSignature);

export { router };
