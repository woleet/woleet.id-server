import * as Router from 'koa-router';

import { copy } from '../../controllers/utils/copy';
import { validate } from '../schemas';
import { createUser, getUserById, updateUser, getAllUsers, deleteUser } from '../../controllers/user';
import { serialiseUser } from '../serialize/user';
import { store as event } from '../../controllers/server-event';

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

  const created = await createUser(copy(user));

  event.register({
    type: 'user.create',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: created.id,
    associatedKeyId: null,
    data: hidePassword(user)
  });

  ctx.body = serialiseUser(created);
});

/**
 * @route: /user/list
 * @swagger
 *  operationId: getUserList
 */
router.get('/list', async function (ctx) {
  const users = await getAllUsers();
  ctx.body = users.map((user) => serialiseUser(user));
});

/**
 * @route: /user/{userId}
 * @swagger
 *  operationId: getUserById
 */
router.get('/:id', vid, async function (ctx) {
  const { id } = ctx.params;
  const user = await getUserById(id);
  ctx.body = serialiseUser(user);
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
  const user = await updateUser(id, copy(update));

  event.register({
    type: 'user.edit',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: user.id,
    associatedKeyId: null,
    data: hidePassword(update)
  });

  ctx.body = serialiseUser(user);
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

  ctx.body = serialiseUser(user);
});

export { router };
