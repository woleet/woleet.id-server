import * as Router from 'koa-router';

import { validate } from '../schemas';
import { getServerConfig, setServerConfig } from '../../controllers/server-config';
import { store as event } from '../../controllers/server-event';
import { serializeServerConfig } from '../serialize/server-config';
import { BadRequest } from 'http-errors';

/**
 * ServerConfig
 */

const router = new Router({ prefix: '/server-config' });

/**
 * @route: /config
 * @swagger
 *  operationId: getServerConfig
 */
router.get('/', function (ctx) {
  ctx.body = serializeServerConfig(getServerConfig());
});

/**
 * @route: /config
 * @swagger
 *  operationId: updateServerConfig
 */
router.put('/', validate.body('updateConfig'), async function (ctx) {
  let config;

  config = await setServerConfig(ctx.request.body);

  event.register({
    type: 'config.edit',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: null,
    data: ctx.request.body
  });

  ctx.body = serializeServerConfig(config);
});

export { router };
