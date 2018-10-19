import * as Router from 'koa-router';
import { getServerConfig } from '../../controllers/server-config';

/**
 * AppConfig
 */

const router = new Router({ prefix: '/app-config' });

router.get('/', async function (ctx) {
  const { useOpenIDConnect } = getServerConfig();
  ctx.body = { useOpenIDConnect };
});

export { router };
