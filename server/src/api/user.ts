import { NotImplemented } from "http-errors";
import { validate } from './schemas'
import * as Router from "koa-router";

import * as Debug from 'debug';
const debug = Debug('id:api:key');

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
  const { name, status } = ctx.request.body;
  throw new NotImplemented();
});

/**
 * @route: /user/{userId}
 * @swagger
 *  operationId: getUserById
 */
router.get('/:id', vid, async function (ctx) {
  throw new NotImplemented();
});

/**
 * @route: /user/{userId}
 * @schema: key.put
 * @swagger
 *  operationId: updateUser
 */
router.put('/:id', vid, validate.body('updateUser'), async function (ctx) {
  const { id } = ctx.params;
  const { name, status } = ctx.request.body;
  throw new NotImplemented();
});

/**
 * @route: /user/{userId}
 * @schema: key.put
 * @swagger
 *  operationId: deleteUser
 */
router.delete('/:id', vid, async function (ctx) {
  const { id } = ctx.params;
  throw new NotImplemented();
});

export { router };
