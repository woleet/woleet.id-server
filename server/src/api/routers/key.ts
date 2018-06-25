import { NotImplemented } from "http-errors";
import { validate } from '../schemas';
import * as Router from "koa-router";

import * as Debug from 'debug';
const debug = Debug('id:api:key');

const vkid = validate.param('id', 'uuid');
const vuid = validate.param('userId', 'uuid');

/**
 * Key
 * Request handlers for key.
 * @swagger
 *  tags: [key]
 */

const router = new Router({ prefix: '/user/:userId/key' });

/**
 * @route: /key/
 * @swagger
 *  operationId: addKey
 */
router.post('/', vuid, validate.body('addKey'), function (ctx) {
  const { name, status } = ctx.request.body;
  debug('addkey', { name, status });
  throw new NotImplemented();
});

/**
 * @route: /key/{keyId}
 * @swagger
 *  operationId: getKeyById
 */
router.get('/:id', vuid, vkid, function (ctx) {
  console.log('Validated UUID')
  throw new NotImplemented();
});

/**
 * @route: /key/{keyId}
 * @schema: key.put
 * @swagger
 *  operationId: updateKey
 */
router.put('/:id', vuid, vkid, validate.body('updateKey'),
  async function (ctx) {
    const { id } = ctx.params;
    const { name, status } = ctx.request.body;
    throw new NotImplemented();
  });

/**
 * @route: /key/{keyId}
 * @schema: key.put
 * @swagger
 *  operationId: updateKey
 */
router.delete('/:id', vuid, vkid, async function (ctx) {
  const { id } = ctx.params;
  throw new NotImplemented();
});

export { router };
