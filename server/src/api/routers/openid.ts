import * as Router from 'koa-router';
import { getUserById } from '../../controllers/user';
import { oauthCallbackEndpoint, oauthLoginEndpoint } from '../../controllers/openid';
import { serializeUserDTO } from '../serialize/userDTO';

const router = new Router({ prefix: '/oauth' });

/**
 * @route: /oauth/login
 */
router.get('/login', async function (ctx) {
  await oauthLoginEndpoint(ctx);
});

/**
 * @route: /oauth/callback
 */
router.get('/callback', async function (ctx) {
  const callbackOutput = await oauthCallbackEndpoint(ctx);
  return ctx.body = { user: serializeUserDTO(await getUserById(callbackOutput.userId)) };
});

export { router };
