import { validate } from '../schemas';
import * as Router from 'koa-router';

import { userCreateKey, getAllKeysOfUser } from '../../controllers/key';
import { serializeKey } from '../serialize/key';
import { store as event } from '../../controllers/server-event';
import { BadRequest } from 'http-errors';

/**
 * Key
 * Request handlers for key by user.
 * @swagger
 *  tags: [userkey]
 */
const router = new Router({ prefix: '/userkey' });

/**
 * @route: /userkey/create
 * @swagger
 *  operationId: createKey
 */
router.post('/create', validate.body('createKey'), async function (ctx) {
  const userId = ctx.session.user.get('id');
  const key: ApiPostKeyObject = ctx.request.body;

  let created;

  try {
    created = await userCreateKey(userId, key);
  } catch (error) {
    throw new BadRequest(error);
  }

  event.register({
    type: 'key.create',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: created.id,
    data: key
  });

  ctx.body = serializeKey(created);
});

/**
 * @route: /userkey/getall
 * @swagger
 *  operationId: getAll
 */
router.get('/getall', async function (ctx) {
  const userId = ctx.session.user.get('id');
  const keys = await getAllKeysOfUser(userId);
  ctx.body = keys.map(serializeKey);
});

export { router };
