import * as Router from 'koa-router';

import { validate } from '../schemas';
import { createAPIKey, updateAPIKey, getAPIKeyById, getAllAPIKeys, deleteAPIKey } from '../../controllers/api-key';
import { serialiseApiKey } from '../serialize/api-key';

const vid = validate.param('id', 'uuid');

/**
 * APIKey
 * Request handlers for api key.
 * @swagger
 *  tags: [APIKey]
 */

const router = new Router({ prefix: '/api-key' });

/**
 * @route: /api-key/
 * @swagger
 *  operationId: createAPIKey
 */
router.post('/', validate.body('createApiKey'), async function (ctx) {
  const apiKey: ApiPostAPIKeyObject = ctx.request.body;
  ctx.body = serialiseApiKey(await createAPIKey(apiKey));
});

/**
 * @route: /api-key/list
 * @swagger
 *  operationId: getAPIKeyList
 */
router.get('/list', async function (ctx) {
  const full = (ctx.query.full || '').toLowerCase() === 'true';
  const users = await getAllAPIKeys(full);
  ctx.body = users.map(serialiseApiKey);
});

/**
 * @route: /api-key/{id}
 * @swagger
 *  operationId: getAPIKeyById
 */
router.get('/:id', vid, async function (ctx) {
  const { id } = ctx.params;
  const apiKey = await getAPIKeyById(id);
  ctx.body = serialiseApiKey(apiKey);
});

/**
 * @route: /api-key/{id}
 * @schema: key.put
 * @swagger
 *  operationId: updateAPIKey
 */
router.put('/:id', vid, validate.body('updateApiKey'), async function (ctx) {
  const { id } = ctx.params;
  const update: ApiPutAPIKeyObject = ctx.request.body;
  const apiKey = await updateAPIKey(id, update);
  ctx.body = serialiseApiKey(apiKey);
});

/**
 * @route: /api-key/{id}
 * @schema: key.put
 * @swagger
 *  operationId: updateAPIKey
 */
router.delete('/:id', vid, async function (ctx) {
  const { id } = ctx.params;
  const apiKey = await deleteAPIKey(id);
  ctx.body = serialiseApiKey(apiKey);
});

export { router };
