import * as Router from 'koa-router';

import { copy } from '../../controllers/utils/copy';
import { validate } from '../schemas';
import { createAPIToken, updateAPIToken, getAPITokenById, getAllAPITokens, deleteAPIToken } from '../../controllers/api-token';
import { serializeapiToken } from '../serialize/api-token';
import { store as event } from '../../controllers/server-event';

const vid = validate.param('id', 'uuid');

function hideTokenValue(token) {
  if (token.value) {
    const t = copy(token);
    delete t.value;
    return t;
  }
  return token;
}

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
  const token: ApiPostAPITokenObject = ctx.request.body;

  const created = await createAPIToken(token);

  event.register({
    type: 'token.create',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: created.id,
    associatedUserId: null,
    associatedKeyId: null,
    data: hideTokenValue(token)
  });

  ctx.body = await serializeapiToken(created);
});

/**
 * @route: /api-token/list
 * @swagger
 *  operationId: getAPITokenList
 */
router.get('/list', async function (ctx) {
  const users = await getAllAPITokens();
  ctx.body = await Promise.all(users.map(serializeapiToken));
});

/**
 * @route: /api-token/{id}
 * @swagger
 *  operationId: getAPITokenById
 */
router.get('/:id', vid, async function (ctx) {
  const { id } = ctx.params;
  const apiToken = await getAPITokenById(id);
  ctx.body = await serializeapiToken(apiToken);
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

  event.register({
    type: 'token.edit',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: apiToken.id,
    associatedUserId: null,
    associatedKeyId: null,
    data: update
  });

  ctx.body = await serializeapiToken(apiToken);
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

  event.register({
    type: 'token.delete',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: apiToken.id,
    associatedUserId: null,
    associatedKeyId: null,
    data: null
  });

  ctx.body = await serializeapiToken(apiToken);
});

export { router };
