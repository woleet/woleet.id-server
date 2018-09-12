import * as Router from 'koa-router';

import { getServerConfig, setServerConfig } from '../../controllers/server-config';

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
router.put('/', async function (ctx) {
  const { fallbackOnDefaultKey, defaultKeyId } = ctx.request.body;
  ctx.body = await setServerConfig({ fallbackOnDefaultKey, defaultKeyId });
});

export { router };
