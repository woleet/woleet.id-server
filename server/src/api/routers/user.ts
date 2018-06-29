import * as Router from "koa-router";

import { validate } from '../schemas';
import { createUser, getUserById, updateUser, getAllUsers } from '../../ctr/user';
import { serialiseUser } from "../serialize/user";

const vid = validate.param('id', 'uuid');

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
  ctx.body = serialiseUser(await createUser(user));
});

/**
 * @route: /user/list
 * @swagger
 *  operationId: getUserList
 */
router.get('/list', async function (ctx) {
  const users = await getAllUsers();
  ctx.body = users.map(serialiseUser);
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
  const user = await updateUser(id, update);
  ctx.body = serialiseUser(user);
});

export { router };
