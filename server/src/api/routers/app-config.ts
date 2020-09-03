import * as Router from 'koa-router';
import * as send from 'koa-send';
import * as path from 'path';
import { getServerConfig } from '../../controllers/server-config';
import { getUserById } from '../../controllers/user';

/**
 * AppConfig
 */
const router = new Router();
const serverBase = path.join(__dirname, '../../..');

router.get('/app-config', async function (ctx) {
  const user = ctx.session && ctx.session.userId && await getUserById(ctx.session.userId) || null;
  const hasSession = !!(ctx.session && ctx.session.userId);
  const {
    enableOpenIDConnect, OIDCPProviderURL, logoURL,
    HTMLFrame, enableSMTP, webClientURL, contact, organizationName, askForResetInput
  } = getServerConfig();
  ctx.body = {
    enableOpenIDConnect: enableOpenIDConnect, OIDCPProviderURL, hasSession, user, logoURL,
    HTMLFrame, enableSMTP: enableSMTP, webClientURL, contact, organizationName, askForResetInput
  };
});

// serve the TCU file via the server assets
router.get('/assets/custom_TCU.pdf', async ctx => send(ctx, ctx.path, {
  root: serverBase,
}));

export { router };
