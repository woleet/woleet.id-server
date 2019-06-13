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
  const {
    enableOpenIDConnect, OIDCPProviderURL, logoURL,
    HTMLFrame, enableSMTP, webClientURL, TCU, contact, organizationName
  } = getServerConfig();
  ctx.body = {
    enableOpenIDConnect: enableOpenIDConnect, OIDCPProviderURL, hasSession, user, logoURL,
    HTMLFrame, enableSMTP: enableSMTP, webClientURL, TCU, contact, organizationName
  };
});

export { router };
