import { Conflict, NotFound } from "http-errors";
import * as Router from "koa-router";
import * as Debug from 'debug';

import { validate } from './schemas';
import { createUser, getUserById, updateUser } from '../ctr/user';
import { ApiPostUserObject } from "../typings";
import { serialiseUser } from "./serialize/user";

const debug = Debug('id:api:user');

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
  try {
    ctx.body = serialiseUser(await createUser(user));
  } catch (err) {
    switch (err.name) {
      case 'DuplicatedUserError':
        throw new Conflict(err.message);
      default:
        throw err;
    }
  }
});

/**
 * @route: /user/{userId}
 * @swagger
 *  operationId: getUserById
 */
router.get('/:id', vid, async function (ctx) {
  const { id } = ctx.params;

  const user = await getUserById(id);

  if (!user)
    throw new NotFound;

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
  try {
    const user = await updateUser(id, update);

    if (!user)
      throw new NotFound;

    ctx.body = serialiseUser(user);
  } catch (err) {
    switch (err.name) {
      case 'DuplicatedUserError':
        throw new Conflict(err.message);
      default:
        throw err;
    }
  }
});

export { router };
