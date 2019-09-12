import * as Router from 'koa-router';

import { copy } from '../../controllers/utils/copy';
import { validate } from '../schemas';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../../controllers/user';
import { serializeUser } from '../serialize/user';
import { store as event } from '../../controllers/server-event';
import { isKeyHeldByServer } from '../../controllers/key';
import { BadRequest, Unauthorized } from 'http-errors';

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

  if (user.mode === 'esign' && !user.email) {
    throw new BadRequest('The email is mandatory for e-signature users');
  }

  if ((!user.mode || user.mode === 'seal') && !user.identity.organization) {
    throw new BadRequest('The organization is mandatory for seal users');
  }

  const authorizedUser = await getUserById(ctx.session.user.get('id'));
  if (user.role === 'admin' && authorizedUser.role !== 'admin') {
    throw new Unauthorized('Only admin can create other admin.');
  }

  const created = await createUser(copy(user));

  event.register({
    type: 'user.create',
    authorizedUserId: ctx.session.user.get('id'),
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
  const users = await getAllUsers();
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
  if (!isKeyHeldByServer(update.defaultKeyId)) {
    throw new BadRequest('User holded key cannot be the default key.');
  }

  let user = await getUserById(id);

  const authorizedUser = await getUserById(ctx.session.user.get('id'));
  if ((update.role && authorizedUser.role !== 'admin')
    || (user.role === 'admin' && authorizedUser.role !== 'admin')) {
    throw new Unauthorized('Only admin can create other admin.');
  }
  user = await updateUser(id, copy(update));

  event.register({
    type: 'user.edit',
    authorizedUserId: ctx.session.user.get('id'),
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
  const user = await deleteUser(id);

  event.register({
    type: 'user.delete',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: user.id,
    associatedKeyId: null,
    data: null
  });

  ctx.body = serializeUser(user);
});

export { router };
