import * as Router from 'koa-router';
import { copy } from '../../controllers/utils/copy';
import { validate } from '../schemas';
import {
  createAPIToken, deleteAPIToken, getAllAPITokens, getAPITokenById, getAPITokensByUser, updateAPIToken
} from '../../controllers/api-token';
import { serializeAPIToken } from '../serialize/api-token';
import { store as event } from '../../controllers/server-event';
import { Forbidden } from 'http-errors';

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

  if (!token.userId && ctx.session.userRole !== 'admin') {
    throw new Forbidden('Only admin can create other admin API token');
  }

  if (ctx.session.userRole === 'user' && (token.userId !== ctx.session.userId)) {
    throw new Forbidden('User can only create token for themselves');
  }

  const created = await createAPIToken(token);

  event.register({
    type: 'token.create',
    authorizedUserId: ctx.session.userId,
    associatedTokenId: created.id,
    associatedUserId: token.userId || null,
    associatedKeyId: null,
    data: hideTokenValue(token)
  });

  ctx.body = await serializeAPIToken(created);
});

/**
 * @route: /api-token/list
 * @swagger
 *  operationId: getAPITokenList
 */
router.get('/list', async function (ctx) {
  const apiTokens = ctx.session.userRole === 'user' ? await getAPITokensByUser(ctx.session.userId) : await getAllAPITokens();
  ctx.body = await Promise.all(apiTokens.map(serializeAPIToken));
});

/**
 * @route: /api-token/{id}
 * @swagger
 *  operationId: getAPITokenById
 */
router.get('/:id', vid, async function (ctx) {
  const { id } = ctx.params;
  const apiToken = await getAPITokenById(id);

  if (ctx.session.userRole === 'user' && (apiToken.userId !== ctx.session.userId)) {
    throw new Forbidden('User can only get their own token');
  }

  ctx.body = await serializeAPIToken(apiToken);
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

  const apiToken = await updateAPIToken(id, update, ctx.session.userId, ctx.session.userRole);

  event.register({
    type: 'token.edit',
    authorizedUserId: ctx.session.userId,
    associatedTokenId: apiToken.id,
    associatedUserId: apiToken.userId || null,
    associatedKeyId: null,
    data: update
  });

  ctx.body = await serializeAPIToken(apiToken);
});

/**
 * @route: /api-token/{id}
 * @schema: key.put
 * @swagger
 *  operationId: updateAPIToken
 */
router.delete('/:id', vid, async function (ctx) {
  const { id } = ctx.params;
  const apiToken = await deleteAPIToken(id, ctx.session.userId, ctx.session.userRole);

  event.register({
    type: 'token.delete',
    authorizedUserId: ctx.session.userId,
    associatedTokenId: apiToken.id,
    associatedUserId: null,
    associatedKeyId: null,
    data: null
  });

  ctx.body = await serializeAPIToken(apiToken);
});

export { router };
