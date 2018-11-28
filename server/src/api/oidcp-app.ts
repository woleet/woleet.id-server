import * as Koa from 'koa';
import * as URL from 'url';
import * as Router from 'koa-router';
import * as querystring from 'querystring';
import { BadRequest } from 'http-errors';

import * as Debug from 'debug';
const debug = Debug('id:oidc:app');

import { SessionNotFound } from 'oidc-provider/lib/helpers/errors';
import { getProvider } from '../controllers/oidc-provider';

import { session } from './authentication';
import { getServerConfig } from '../controllers/server-config';

export function build(): Koa {
  const router = new Router();
  const provider = getProvider();

  router.use(async (ctx, next) => {
    ctx.set('Pragma', 'no-cache');
    ctx.set('Cache-Control', 'no-cache, no-store');
    try {
      await next();
    } catch (err) {
      if (err instanceof SessionNotFound) {
        ctx.status = err.status;
        throw new BadRequest(err.message);
      } else {
        console.warn('OIDCERR', err);
        throw err;
      }
    }
  });

  router.get('/interaction/:grant', async (ctx, next) => {
    const details = await provider.interactionDetails(ctx.req);

    if (details.interaction.error === 'login_required') {
      throw new Error('Should not be called because we handle this case earlier in the process (#login-precondition)');
    } else if (details.interaction.error === 'consent_required') {
      throw new Error('Should not be called because this interaction is skipped (#skipped-authorize-interaction)');
    } else {
      throw new Error('Unexpected interaction case');
    }

    await next();
  });

  provider.use(session);

  router.get('/auth', async (ctx, next) => {
    const config = getServerConfig();

    debug('pre auth', ctx['oidc'], `session=${ctx.session && ctx.session.id}`, `user=${ctx.session && ctx.session.user.get('id')}`);

    if (ctx.session) {
      await provider.setProviderSession(ctx.req, ctx.res, { account: ctx.session && ctx.session.user.get('id') });
    } else {
      // #login-precondition
      if (!ctx.header.referer) {
        throw new BadRequest('Missing referer');
      }

      const referer = URL.parse(ctx.header.referer);

      if (referer.protocol !== 'https:') {
        throw new BadRequest('Invalid referer protocol');
      }

      if (!referer.host) {
        throw new BadRequest('Invalid referer');
      }

      debug(`Login redirect URL will be set to ${ctx.request.url}`);

      const redirect = Buffer.from(ctx.request.url).toString('base64');
      const origin = Buffer.from(ctx.header.referer).toString('base64');
      // redirect to UI to login
      ctx.redirect(`${config.OIDCPInterfaceURL}/login?` + querystring.stringify({
        origin: `oidcp=${origin}`,
        redirect
      }));
      return;
    }

    await next();
  });

  const app = <Koa>provider.app;

  provider.use(router.routes());

  return app;
}
