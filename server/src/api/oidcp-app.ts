import * as Koa from 'koa';
import * as Router from 'koa-router';
import { BadRequest, Unauthorized } from 'http-errors';
import * as log from 'loglevel';
import * as Debug from 'debug';
import { SessionNotFound } from 'oidc-provider/lib/helpers/errors';
import { getUserFromUserPass } from '../controllers/authentication';
import { getProvider } from '../controllers/oidc-provider';
import { session as sessionAuth } from './authentication';
import * as bodyParser from 'koa-bodyparser';
import * as cors from '@koa/cors';
import { store as event } from '../controllers/server-event';
import * as render from 'koa-ejs';

const path = require('path');

const debug = Debug('id:oidc:app');

// Original example: https://github.com/panva/node-oidc-provider/blob/v7.x/example/routes/koa.js
export function build(): Koa {
  const provider = getProvider();
  const router = new Router();

  // This is the configuration koa-ejs uses to display OIDC login/logout pages
  // These pages are stored in the asset/oidcp-views folder
  render(provider.app, {
    cache: false,
    viewExt: 'ejs',
    layout: '_layout',
    root: path.join(__dirname, '../../assets/oidcp-views'),
  });

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
        log.error('OIDC error', err);
        throw err;
      }
    }
  });

  provider.use(sessionAuth);

  // Custom configuration of koa-bodyparser to be used by node-oidc-provider
  const bodyparser = bodyParser({
    text: false, json: false, patchNode: true, patchKoa: true,
  });

  // Endpoint called by the login page rendered by the koa-ejs middleware
  router.post('/interaction/:uid/login', bodyparser, async (ctx) => {
    const { uid, prompt, params, session } = await provider.interactionDetails(ctx.req, ctx.res);
    const client = await provider.Client.find(params.client_id);
    if (prompt.name !== 'login') {
      throw new Error('Should have the login interaction');
    }

    const body = ctx.request.body;

    const authorization = await getUserFromUserPass(body.login, body.password);
    if (!authorization) {
      return ctx.render('login', {
        error: new Unauthorized(),
        client,
        uid,
        details: prompt.details,
        params,
        title: 'Sign-in',
        session: session ? debug(session) : undefined,
        dbg: {
          params: debug(params),
          prompt: debug(prompt),
        },
      });
    }

    event.register({
      type: 'login',
      authorizedUserId: authorization.user.id,
      associatedTokenId: null,
      associatedUserId: null,
      associatedKeyId: null,
      data: null
    });

    const result = {
      login: {
        accountId: authorization.user.id,
      },
    };

    return provider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: false,
    });
  });

  // This endpoint renders the login / consent page if needed
  router.get('/interaction/:uid', async (ctx, next) => {
    const { uid, prompt, params, session } = await provider.interactionDetails(ctx.req, ctx.res);
    const client = await provider.Client.find(params.client_id);

    switch (prompt.name) {
      case 'login': {
        return ctx.render('login', {
          error: null,
          client,
          uid,
          details: prompt.details,
          params,
          title: 'Sign-in',
          session: session ? debug(session) : undefined,
          dbg: {
            params: debug(params),
            prompt: debug(prompt),
          },
        });
      }
      case 'consent': {
        return ctx.render('interaction', {
          client,
          uid,
          details: prompt.details,
          params,
          title: 'Authorize',
          session: session ? debug(session) : undefined,
          dbg: {
            params: debug(params),
            prompt: debug(prompt),
          },
        });
      }
      default:
        return next();
    }
  });

  // Endpoint called by the consent page rendered by the koa-ejs middleware
  router.post('/interaction/:uid/confirm', async (ctx) => {
    const interactionDetails = await provider.interactionDetails(ctx.req, ctx.res);
    const { prompt, params, session: { accountId } } = interactionDetails;
    if (prompt.name !== 'consent') {
      throw new Error('Should have the consent interaction');
    }

    let { grantId } = interactionDetails;
    let grant;

    if (grantId) {
      // we'll be modifying existing grant in existing session
      grant = await provider.Grant.find(grantId);
    } else {
      // we're establishing a new grant
      grant = new provider.Grant({
        accountId,
        clientId: params.client_id,
      });
    }

    if (prompt.details.missingOIDCScope) {
      grant.addOIDCScope(prompt.details.missingOIDCScope.join(' '));
    }
    if (prompt.details.missingOIDCClaims) {
      grant.addOIDCClaims(prompt.details.missingOIDCClaims);
    }
    if (prompt.details.missingResourceScopes) {
      for (const [indicator, scope] of Object.entries(prompt.details.missingResourceScopes)) {
        grant.addResourceScope(indicator, (scope as Array<string>).join(' '));
      }
    }

    grantId = await grant.save();

    const consent = {} as any;
    if (!interactionDetails.grantId) {
      // we don't have to pass grantId to consent, we're just modifying existing one
      consent.grantId = grantId;
    }

    const result = { consent };
    return provider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: true,
    });
  });

  router.get('/interaction/:uid/abort', async (ctx) => {
    const { params } = await provider.interactionDetails(ctx.req, ctx.res);
    const redirectURI = new URL(params.redirect_uri);
    ctx.redirect(redirectURI.origin);
  });

  provider.use(router.routes());
  provider.use(cors());
  return provider.app;
}
