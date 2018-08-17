import { NotImplemented } from "http-errors";
import { validate } from '../schemas';
import * as Router from "koa-router";

import * as Debug from 'debug';
import { getKeyById, createKey, updateKey, getAllKeysOfUser, deleteKey, exportKey } from "../../controllers/key";
import { serialiseKey } from "../serialize/key";
const debug = Debug('id:api:key');

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
 *  operationId: addKey
 */
router.post('/user/:userId/key', vuid, validate.body('createKey'), async function (ctx) {
  const key: ApiPostKeyObject = ctx.request.body;
  debug('addkey', key);
  const { userId } = ctx.params;
  ctx.body = serialiseKey(await createKey(userId, key));
});

/**
 * @route: /user/{userId}/key/list
 * @swagger
 *  operationId: getKeysOfUser
 */
router.get('/user/:userId/key/list', vuid, async function (ctx) {
  const { userId } = ctx.params;
  const keys = await getAllKeysOfUser(userId);
  ctx.body = keys.map(serialiseKey);
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
 * @route: /key/{keyId}
 * @swagger
 *  operationId: getKeyById
 */
router.get('/key/:id', vkid, async function (ctx) {
  const { id } = ctx.params;
  const apiKey = await getKeyById(id);
  ctx.body = serialiseKey(apiKey);
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
  const apiKey = await updateKey(id, update);
  ctx.body = serialiseKey(apiKey);
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
  ctx.body = serialiseKey(key);
});

export { router };
