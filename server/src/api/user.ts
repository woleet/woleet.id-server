import { Request, Response, NextFunction, Router } from "express";
import { NotImplementedError } from "http-typed-errors";
import { validate } from './schemas'

/**
 * User
 * Request handlers for user.
 * @swagger
 *  tags: [user]
 */

const router = Router();

/**
 * @route: /user/
 * @swagger
 *  operationId: createUser
 */
router.post('/', validate('createUser'), async function (req, res, next) {
  const { name, status } = req.body;
  throw new NotImplementedError();
});

/**
 * @route: /user/{userId}
 * @swagger
 *  operationId: getUserById
 */
router.get('/:id', async function (req, res, next) {
  throw new NotImplementedError();
});

/**
 * @route: /user/{userId}
 * @schema: key.put
 * @swagger
 *  operationId: updateUser
 */
router.put('/:id', validate('updateUser'), async function (req, res, next) {
  const { id } = req.params;
  const { name, status } = req.body;
  throw new NotImplementedError();
});

/**
 * @route: /user/{userId}
 * @schema: key.put
 * @swagger
 *  operationId: deleteUser
 */
router.delete('/:id', async function (req, res, next) {
  const { id } = req.params;
  throw new NotImplementedError();
});

export { router };
