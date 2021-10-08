import * as Router from 'koa-router';
import { copy } from '../../controllers/utils/copy';
import { validate } from '../schemas';
import {
  createAPIToken, deleteAPIToken, getAllAPITokens, getAPITokenById, getAPITokensByUser, updateAPIToken
} from '../../controllers/api-token';
import { serializeAPIToken } from '../serialize/api-token';
import { store as event } from '../../controllers/server-event';
import { Forbidden } from 'http-errors';
import { getUserById } from '../../controllers/user';

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

  if (ctx.authorizedUser && !token.userId && (ctx.authorizedUser.userRole !== 'admin')) {
    throw new Forbidden('Only an admin can create other admin API token');
  }

  if (ctx.authorizedUser && token.userId) {
    const user = await getUserById(token.userId);
    if (user.role === 'admin' && ctx.authorizedUser.userRole !== 'admin') {
      throw new Forbidden('Only an admin can create API token for admin user');
    }
  }

  const created = await createAPIToken(token);

  event.register({
    type: 'token.create',
    authorizedUserId: ctx.authorizedUser && ctx.authorizedUser.userId ? ctx.authorizedUser.userId : null,
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
  const apiTokens = await getAllAPITokens(ctx.authorizedUser ? ctx.authorizedUser.userRole : null);
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

  if (ctx.authorizedUser && apiToken.userId) {
    const user = await getUserById(apiToken.userId);
    if (user.role === 'admin' && ctx.authorizedUser.userRole !== 'admin') {
      throw new Forbidden('Only an admin can get admin users API token');
    }
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

  const apiToken = await updateAPIToken(id, update, ctx.authorizedUser && ctx.authorizedUser.userRole);

  event.register({
    type: 'token.edit',
    authorizedUserId: ctx.authorizedUser && ctx.authorizedUser.userId ? ctx.authorizedUser.userId : null,
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
  const apiToken = await deleteAPIToken(id, ctx.authorizedUser && ctx.authorizedUser.userRole);

  event.register({
    type: 'token.delete',
    authorizedUserId: ctx.authorizedUser && ctx.authorizedUser.userId ? ctx.authorizedUser.userId : null,
    associatedTokenId: apiToken.id,
    associatedUserId: null,
    associatedKeyId: null,
    data: null
  });

  ctx.body = await serializeAPIToken(apiToken);
});

export { router };
