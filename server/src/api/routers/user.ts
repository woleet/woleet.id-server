import * as Router from 'koa-router';
import { copy } from '../../controllers/utils/copy';
import { validate } from '../schemas';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../../controllers/user';
import { buildUserFilterFromQueryParams, serializeUser } from '../serialize/user';
import { serverEventLogger } from '../../config';
import { isKeyHeldByServer } from '../../controllers/key';
import { getServerConfig } from '../../controllers/server-config';
import { BadRequest, Forbidden } from 'http-errors';
import { FindOptions } from 'sequelize';

const vid = validate.param('id', 'uuid');

function hidePassword(user) {
  if (user.password) {
    const u = copy(user);
    u.password = '@obfuscated@';
    return u;
  }
  return user;
}

/**
 * User
 * Request handlers for user.
 * @swagger
 *  tags: [user]
 */

const router = new Router({ prefix: '/user' });

/**
 * @route: /user/
 * @swagger
 *  operationId: createUser
 */
router.post('/', validate.body('createUser'), async function (ctx) {
  const user: ApiPostUserObject = ctx.request.body;

  if (getServerConfig().blockPasswordInput && user.password) {
    throw new BadRequest('Server configuration prevent from creating a user with a preset password');
  }

  if (user.mode === 'esign' && !user.email) {
    throw new BadRequest('The email is mandatory for e-signature users');
  }

  if ((!user.mode || user.mode === 'seal') && !user.identity.organization) {
    throw new BadRequest('The organization is mandatory for seal users');
  }

  if (!(ctx.token && ctx.token.role === 'admin')) {
    const authorizedUser = await getUserById(ctx.authorizedUser.userId);
    if (user.role === 'admin' && authorizedUser.role !== 'admin') {
      throw new Forbidden('Only an admin can create another admin');
    }
  }

  const created = await createUser(copy(user));

  serverEventLogger.info({
    type: 'user.create',
    authorizedUserId: ctx.authorizedUser && ctx.authorizedUser.userId ? ctx.authorizedUser.userId : null,
    associatedTokenId: null,
    associatedUserId: created.id,
    associatedKeyId: null,
    data: hidePassword(user)
  });

  ctx.body = serializeUser(created);
});

/**
 * @route: /user/list
 * @swagger
 *  operationId: getUserList
 */
router.get('/list', async function (ctx) {
  const query = ctx.query;
  const opts: FindOptions = { where: buildUserFilterFromQueryParams(query), offset: query.offset, limit: query.limit };
  const users = await getUsers(opts);
  ctx.body = users.map((user) => serializeUser(user));
});

/**
 * @route: /user/{userId}
 * @swagger
 *  operationId: getUserById
 */
router.get('/:id', vid, async function (ctx) {
  const { id } = ctx.params;
  const user = await getUserById(id);
  ctx.body = serializeUser(user);
});

/**
 * @route: /user/{userId}
 * @schema: key.put
 * @swagger
 *  operationId: updateUser
 */
router.put('/:id', vid, validate.body('updateUser'), async function (ctx) {
  const { id } = ctx.params;
  const update = ctx.request.body;

  if (getServerConfig().blockPasswordInput && update.password) {
    throw new BadRequest('Server configuration prevent from creating a user with a preset password');
  }

  if (update.defaultKeyId) {
    const isPair = await isKeyHeldByServer(update.defaultKeyId);
    if (!isPair) {
      throw new BadRequest('User held key cannot be the default key');
    }
  }

  let user = await getUserById(id);

  if (!(ctx.token && ctx.token.role === 'admin')) {
    const authorizedUser = await getUserById(ctx.authorizedUser.userId);
    if ((update.role === 'admin' && authorizedUser.role !== 'admin')
      || (user.role === 'admin' && authorizedUser.role !== 'admin')) {
      throw new Forbidden('Only an admin can update another admin');
    }
  }
  user = await updateUser(id, copy(update), ctx.authorizedUser ? ctx.authorizedUser.userRole : null);

  serverEventLogger.info({
    type: 'user.edit',
    authorizedUserId: ctx.authorizedUser && ctx.authorizedUser.userId ? ctx.authorizedUser.userId : null,
    associatedTokenId: null,
    associatedUserId: user.id,
    associatedKeyId: null,
    data: hidePassword(update)
  });

  ctx.body = serializeUser(user);
});

/**
 * @route: /user/{userId}
 * @swagger
 *  operationId: deleteUser
 */
router.delete('/:id', vid, async function (ctx) {
  const { id } = ctx.params;
  const user = await deleteUser(id, ctx.authorizedUser ? ctx.authorizedUser.userRole : null);

  serverEventLogger.info({
    type: 'user.delete',
    authorizedUserId: ctx.authorizedUser && ctx.authorizedUser.userId ? ctx.authorizedUser.userId : null,
    associatedTokenId: null,
    associatedUserId: user.id,
    associatedKeyId: null,
    data: null
  });

  ctx.body = serializeUser(user);
});

export { router };
