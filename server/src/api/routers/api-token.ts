import * as Router from 'koa-router';

import { validate } from '../schemas';
import { createAPIToken, updateAPIToken, getAPITokenById, getAllAPITokens, deleteAPIToken } from '../../controllers/api-token';
import { serialiseapiToken } from '../serialize/api-token';

const vid = validate.param('id', 'uuid');

/**
 * APIToken
 * Request handlers for API token.
 * @swagger
 *  tags: [APIToken]
 */

const router = new Router({ prefix: '/api-token' });

/**
 * @route: /api-token/
 * @swagger
 *  operationId: createAPIToken
 */
router.post('/', validate.body('createApiToken'), async function (ctx) {
  const apiToken: ApiPostAPITokenObject = ctx.request.body;
  ctx.body = serialiseapiToken(await createAPIToken(apiToken));
});

/**
 * @route: /api-token/list
 * @swagger
 *  operationId: getAPITokenList
 */
router.get('/list', async function (ctx) {
  const full = (ctx.query.full || '').toLowerCase() === 'true';
  const users = await getAllAPITokens(full);
  ctx.body = users.map(serialiseapiToken);
});

/**
 * @route: /api-token/{id}
 * @swagger
 *  operationId: getAPITokenById
 */
router.get('/:id', vid, async function (ctx) {
  const { id } = ctx.params;
  const apiToken = await getAPITokenById(id);
  ctx.body = serialiseapiToken(apiToken);
});

/**
 * @route: /api-token/{id}
 * @schema: key.put
 * @swagger
 *  operationId: updateAPIToken
 */
router.put('/:id', vid, validate.body('updateApiToken'), async function (ctx) {
  const { id } = ctx.params;
  const update: ApiPutAPITokenObject = ctx.request.body;
  const apiToken = await updateAPIToken(id, update);
  ctx.body = serialiseapiToken(apiToken);
});

/**
 * @route: /api-token/{id}
 * @schema: key.put
 * @swagger
 *  operationId: updateAPIToken
 */
router.delete('/:id', vid, async function (ctx) {
  const { id } = ctx.params;
  const apiToken = await deleteAPIToken(id);
  ctx.body = serialiseapiToken(apiToken);
});

export { router };
