import * as Router from 'koa-router';
import { getServerConfig } from '../../controllers/server-config';
import { serializeUserDTO } from '../serialize/userDTO';

/**
 * AppConfig
 */

const router = new Router({ prefix: '/app-config' });

router.get('/', async function (ctx) {
  const user = ctx.session && ctx.session.user && serializeUserDTO(ctx.session.user.toJSON()) || null;
  const hasSession = !!(ctx.session && ctx.session.user);
  const { useOpenIDConnect, OIDCPProviderURL, useSMTP } = getServerConfig();
  ctx.body = { useOpenIDConnect, OIDCPProviderURL, hasSession, user };
});

export { router };
