import { validate } from '../schemas';
import * as Router from 'koa-router';
import {
  createExternalKey, createKey, deleteKey, exportKey, getAllKeysOfUser, getKeyById, getOwner, updateKey
} from '../../controllers/key';
import { serializeKey } from '../serialize/key';
import { serverEventLogger } from '../../config';
import { serializeUser } from '../serialize/user';
import { BadRequest, Forbidden } from 'http-errors';
import { production } from '../../config';
import { getUserById } from '../../controllers/user';

const vkid = validate.param('id', 'uuid');
const vuid = validate.param('userId', 'uuid');

/**
 * Key
 * Request handlers for key.
 * @swagger
 *  tags: [key]
 */

const router = new Router();

/**
 * @route: /user/{userId}/key/
 * @swagger
 *  operationId: createKey
 */
router.post('/user/:userId/key', vuid, validate.body('createKey'), async function (ctx) {
  const { userId } = ctx.params;
  const key: ApiPostKeyObject = ctx.request.body;

  if (ctx.authorizedUser && ctx.authorizedUser.userRole === 'manager') {
    const user = await getUserById(userId);
    if (user.role === 'admin') {
      throw new Forbidden('Manager cannot create key for admin user');
    }
  }

  // Verify mnemonic phrase if provided
  if (key.phrase) {
    if (key.phrase.split(' ').length < 12) {
      throw new BadRequest('The phrase length must be at least 12 words');
    } else if (key.phrase.split(' ').length > 50) {
      throw new BadRequest('The phrase length cannot exceed 50 words');
    }
  }

  // Verify that the expiration date is not set in the past
  if (key.expiration != null && key.expiration < Date.now()) {
    throw new BadRequest('Cannot set expiration date in the past');
  }

  // Create the key
  let created;
  try {
    created = await createKey(userId, key);
  } catch (error) {
    throw new BadRequest(error);
  }

  serverEventLogger.info({
    type: 'key.create',
    authorizedUserId: ctx.authorizedUser && ctx.authorizedUser.userId ? ctx.authorizedUser.userId : null,
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: created.id,
    data: key
  });

  ctx.body = serializeKey(created);
});

/**
 * @route: /user/{userId}/key/
 * @swagger
 *  operationId: createExternal-key
 */
router.post('/user/:userId/extern-key', vuid, validate.body('createExternKey'), async function (ctx) {
  const { userId } = ctx.params;
  const key: ApiPostExternalKeyObject = ctx.request.body;

  // Verify that the expiration date is not set in the past
  if (key.expiration != null && key.expiration < Date.now()) {
    throw new BadRequest('Cannot set expiration date in the past');
  }

  // Verify that the expiration date is not set in the past
  let created;
  try {
    created = await createExternalKey(userId, key);
  } catch (error) {
    throw new BadRequest(error);
  }

  serverEventLogger.info({
    type: 'key.create',
    authorizedUserId: ctx.authorizedUser && ctx.authorizedUser.userId ? ctx.authorizedUser.userId : null,
    associatedTokenId: null,
    associatedUserId: userId,
    associatedKeyId: created.id,
    data: key
  });

  ctx.body = serializeKey(created);
});

/**
 * @route: /user/{userId}/key/list
 * @swagger
 *  operationId: getKeysOfUser
 */
router.get('/user/:userId/key/list', vuid, async function (ctx) {
  const { userId } = ctx.params;
  const keys = await getAllKeysOfUser(userId);
  ctx.body = keys.map(serializeKey);
});

/**
 * @route: /key/{keyId}/export
 * @swagger
 *  operationId: exportKey
 */
router.get('/key/:id/export', vkid, async function (ctx) {
  const { id } = ctx.params;
  if (production) {
    throw new Forbidden('Cannot export a key in production mode');
  }
  const phrase = await exportKey(id);
  ctx.body = { phrase };
});

/**
 * @route: /key/{keyId}/owner
 * @swagger
 *  operationId: getKeyOwner
 */
router.get('/key/:id/owner', vkid, async function (ctx) {
  const { id } = ctx.params;
  const user = await getOwner(id);
  ctx.body = serializeUser(user);
});

/**
 * @route: /key/{keyId}
 * @swagger
 *  operationId: getKeyById
 */
router.get('/key/:id', vkid, async function (ctx) {
  const { id } = ctx.params;
  const apiToken = await getKeyById(id);
  ctx.body = serializeKey(apiToken);
});

/**
 * @route: /key/{keyId}
 * @schema: key.put
 * @swagger
 *  operationId: updateKey
 */
router.put('/key/:id', vkid, validate.body('updateKey'), async function (ctx) {
  const { id } = ctx.params;
  const update: ApiPutKeyObject = ctx.request.body;
  const key = await updateKey(id, update);

  serverEventLogger.info({
    type: 'key.edit',
    authorizedUserId: ctx.authorizedUser && ctx.authorizedUser.userId ? ctx.authorizedUser.userId : null,
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: key.id,
    data: update
  });

  ctx.body = serializeKey(key);
});

/**
 * @route: /key/{keyId}
 * @schema: key.put
 * @swagger
 *  operationId: deleteKey
 */
router.delete('/key/:id', vkid, async function (ctx) {
  const { id } = ctx.params;
  const key = await deleteKey(id);

  serverEventLogger.info({
    type: 'key.delete',
    authorizedUserId: ctx.authorizedUser && ctx.authorizedUser.userId ? ctx.authorizedUser.userId : null,
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: key.id,
    data: null
  });

  ctx.body = serializeKey(key);
});

export { router };
