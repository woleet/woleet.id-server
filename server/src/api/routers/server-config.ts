import * as Router from 'koa-router';

import { validate } from '../schemas';
import { getServerConfig, setServerConfig } from '../../controllers/server-config';
import { store as event } from '../../controllers/server-event';
import { serialiseServerConfig } from '../serialize/server-config';

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
  ctx.body = serialiseServerConfig(getServerConfig());
});

/**
 * @route: /config
 * @swagger
 *  operationId: updateServerConfig
 */
router.put('/', validate.body('updateConfig'), async function (ctx) {
  const config = await setServerConfig(ctx.request.body);

  event.register({
    type: 'config.edit',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: null,
    data: ctx.request.body
  });

  ctx.body = serialiseServerConfig(config);
});

export { router };
