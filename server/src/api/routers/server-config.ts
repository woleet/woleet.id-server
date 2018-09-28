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
  const { fallbackOnDefaultKey, defaultKeyId, identityURL } = getServerConfig();
  ctx.body = { fallbackOnDefaultKey, defaultKeyId, identityURL };
});

/**
 * @route: /config
 * @swagger
 *  operationId: updateServerConfig
 */
router.put('/', validate.body('updateConfig'), async function (ctx) {
  const { fallbackOnDefaultKey, defaultKeyId, identityURL } = await setServerConfig(ctx.request.body);

  event.register({
    type: 'config.edit',
    authorizedUserId: ctx.session.user.get('id'),
    associatedTokenId: null,
    associatedUserId: null,
    associatedKeyId: null,
    data: { fallbackOnDefaultKey, defaultKeyId, identityURL }
  });

  ctx.body = { fallbackOnDefaultKey, defaultKeyId, identityURL };
});

export { router };
