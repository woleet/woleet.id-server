import * as Router from 'koa-router';
import * as send from 'koa-send';
import * as path from 'path';
import { getServerConfig } from '../../controllers/server-config';
import { serializeUserDTO } from '../serialize/userDTO';

/**
 * AppConfig
 */
const router = new Router();
const serverBase = path.join(__dirname, '../../..');

router.get('/app-config', async function (ctx) {
  const user = ctx.session && ctx.session.user && serializeUserDTO(ctx.session.user.toJSON()) || null;
  console.log(ctx.session);
  const hasSession = !!(ctx.session && ctx.session.user);
  const {
    enableOpenIDConnect, OIDCPProviderURL, logoURL,
    HTMLFrame, enableSMTP, webClientURL, contact, organizationName
  } = getServerConfig();
  ctx.body = {
    enableOpenIDConnect: enableOpenIDConnect, OIDCPProviderURL, hasSession, user, logoURL,
    HTMLFrame, enableSMTP: enableSMTP, webClientURL, contact, organizationName
  };
});

// serve the TCU file via the server assets
router.get('/assets/custom_TCU.pdf', async ctx => send(ctx, ctx.path, {
  root: serverBase,
}));

export { router };
