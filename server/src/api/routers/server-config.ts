import * as Router from 'koa-router';

import { getServerConfig } from '../../controllers/server-config';

/**
 * ServerConfig
 */

const router = new Router({ prefix: '/server-config' });

/**
 * @route: /config
 * @swagger
 *  operationId: getServerConfgi
 */
router.get('/', async function (ctx) {
  const { fallbackOnDefaultKey, defaultKeyId } = getServerConfig();
  ctx.body = { fallbackOnDefaultKey, defaultKeyId };
});

export { router };
