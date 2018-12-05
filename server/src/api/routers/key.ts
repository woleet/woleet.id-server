import { validate } from '../schemas';
import * as Router from 'koa-router';

import { createKey, deleteKey, exportKey, getAllKeysOfUser, getKeyById, updateKey, getOwner } from '../../controllers/key';
import { serializeKey } from '../serialize/key';
import { store as event } from '../../controllers/server-event';
import { serializeUser } from '../serialize/user';

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

  const created = await createKey(userId, key);

  event.register({
    type: 'key.create',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: null,
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

  event.register({
    type: 'key.edit',
    authorizedUserId: ctx.session.user.get('id'),
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

  event.register({
    type: 'key.delete',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: key.id,
    data: null
  });

  ctx.body = serializeKey(key);
});

export { router };
