import { Router } from "express";
import { NotImplementedError } from "http-typed-errors";
import { validate } from './schemas'

/**
 * Key
 * Request handlers for key.
 * @swagger
 *  tags: [key]
 */

const router = Router();

/**
 * @route: /key/
 * @swagger
 *  operationId: addKey
 */
router.post('/', validate('addKey'), async function (req, res, next) {
  const { name, status } = req.body;
  throw new NotImplementedError();
});

/**
 * @route: /key/{keyId}
 * @swagger
 *  operationId: getKeyById
 */
router.get('/:id', async function (req, res, next) {
  throw new NotImplementedError();
});

/**
 * @route: /key/{keyId}
 * @schema: key.put
 * @swagger
 *  operationId: updateKey
 */
router.put('/:id', validate('updateKey'), async function (req, res, next) {
  const { id } = req.params;
  const { name, status } = req.body;
  throw new NotImplementedError();
});

/**
 * @route: /key/{keyId}
 * @schema: key.put
 * @swagger
 *  operationId: updateKey
 */
router.delete('/:id', async function (req, res, next) {
  const { id } = req.params;
  throw new NotImplementedError();
});

export { router };
