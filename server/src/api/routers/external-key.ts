import { validate } from '../schemas';
import * as Router from 'koa-router';

import { externalCreateKey } from '../../controllers/key';
import { serializeKey } from '../serialize/key';
import { store as event } from '../../controllers/server-event';
import { BadRequest } from 'http-errors';

const vuid = validate.param('userId', 'uuid');

/**
 * Key
 * Request handlers for key by user.
 * @swagger
 *  tags: [external-key]
 */
const router = new Router({ prefix: '/external-key' });

/**
 * @route: /external-key/create
 * @swagger
 *  operationId: createKey
 */
router.post('/create/:userId', vuid, validate.body('createKey'), async function (ctx) {
  const { userId } = ctx.params;
  const key: ApiPostKeyObject = ctx.request.body;

  let created;

  try {
    created = await externalCreateKey(userId, key);
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

export { router };
