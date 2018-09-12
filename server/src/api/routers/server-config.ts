import * as Router from 'koa-router';

import { validate } from '../schemas';
import { getServerConfig, setServerConfig } from '../../controllers/server-config';
import { store as event } from '../../controllers/server-event';

/**
 * ServerConfig
 */

const router = new Router({ prefix: '/server-config' });

/**
 * @route: /config
 * @swagger
 *  operationId: getServerConfig
 */
router.get('/', async function (ctx) {
  const { fallbackOnDefaultKey, defaultKeyId } = getServerConfig();
  ctx.body = { fallbackOnDefaultKey, defaultKeyId };
});

/**
 * @route: /config
 * @swagger
 *  operationId: setServerConfig
 */
router.put('/', validate.body('updateConfig'), async function (ctx) {
  const { fallbackOnDefaultKey, defaultKeyId } = await setServerConfig(ctx.request.body);

  event.register({
    type: 'config.edit',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: null,
    data: { fallbackOnDefaultKey, defaultKeyId }
  });

  ctx.body = { fallbackOnDefaultKey, defaultKeyId };
});

export { router };
