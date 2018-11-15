/* eslint-disable no-console */

import * as Koa from 'koa';
import * as url from 'url';
import * as Router from 'koa-router';
import * as querystring from 'querystring';
import * as bodyParser from 'koa-bodyparser';
import { BadRequest } from 'http-errors';

import * as Debug from 'debug';
const debug = Debug('id:oidc:app');

import { OIDCAccount as Account } from '../database/oidcp-adapter';
import { SessionNotFound } from 'oidc-provider/lib/helpers/errors';
import { getProvider } from '../controllers/oidc-provider';

import { session } from './authentication';
import { getServerConfig } from '../controllers/server-config';
// import { oidcp } from '../config';

export function build(): Koa {
  const router = new Router();
  const provider = getProvider();

  /*
  if (process.env.NODE_ENV === 'production') {
    router.keys = providerConfiguration.cookies.keys;
    router.proxy = true;
    set(providerConfiguration, 'cookies.short.secure', true);
    set(providerConfiguration, 'cookies.long.secure', true);

    router.use(async (ctx, next) => {
      if (ctx.secure) {
        await next();
      } else if (ctx.method === 'GET' || ctx.method === 'HEAD') {
        ctx.redirect(ctx.href.replace(/^http:\/\//i, 'https://'));
      } else {
        ctx.body = {
          error: 'invalid_request',
          error_description: 'do yourself a favor and only use https',
        };
        ctx.status = 400;
      }
    });
  }
  */

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
    /**
     * NOT USED, USE CLIENT
     */
    const details = await provider.interactionDetails(ctx.req);
    console.log('GRANT0', details);
    const client = await provider.Client.find(details.params.client_id);

    if (details.interaction.error === 'login_required') {
      throw new Error('Should not be called because we handle this case earlier in the process (#login-precondition)');
    } else {
    /*await*/ ctx/* .render('interaction', */.body = ({ // TODO:
        client,
        details,
        title: 'Authorize',
        TEST: details.returnTo + querystring.stringify(details.params),
        params: querystring.stringify(details.params, ',<br/>', ' = ', {
          encodeURIComponent: value => value,
        }),
        interaction: querystring.stringify(details.interaction, ',<br/>', ' = ', {
          encodeURIComponent: value => value,
        })
      });
    }

    await next();
  });
  // text: false, json: false
  const body = bodyParser({ enableTypes: [] });

  router.post('/interaction/:grant/confirm', body, async (ctx, next) => {
    debug('grant confirm');
    const result = { consent: {} };
    await provider.interactionFinished(ctx.req, ctx.res, result);
    await next();
  });

  router.post('/interaction/:grant/login', body, async (ctx, next) => {
    const account = await Account.findByLogin(ctx.request.body.login);
    debug('grant login');
    const result = {
      login: {
        account: account.accountId,
        acr: 'urn:mace:incommon:iap:bronze',
        amr: ['pwd'],
        remember: !!ctx.request.body.remember,
        ts: Math.floor(Date.now() / 1000),
      },
      consent: {},
    };

    await provider.interactionFinished(ctx.req, ctx.res, result);
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

      const { protocol, host, port } = url.parse(ctx.header.referer);

      if (protocol !== 'https:') {
        throw new BadRequest('Invalid referer protocol');
      }

      if (!host) {
        throw new BadRequest('Invalid referer');
      }

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
