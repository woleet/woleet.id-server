import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import * as render from 'koa-ejs';
import * as cors from '@koa/cors';
import * as log from 'loglevel';
import * as Debug from 'debug';
import { BadRequest, Unauthorized } from 'http-errors';
import { SessionNotFound } from 'oidc-provider/lib/helpers/errors';
import { getUserFromUserPass } from '../controllers/authentication';
import { getProvider } from '../controllers/oidc-provider';
import { session as sessionAuth } from './authentication';
import { store as event } from '../controllers/server-event';
import { oauthCallbackEndpoint, oauthLoginEndpoint } from '../controllers/openid';
import { store as sessionStore } from '../controllers/store.session';
import { getServerConfig } from '../controllers/server-config';

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
    const openIDConnectEnabled = getServerConfig().enableOpenIDConnect;
    if (prompt.name !== 'login') {
      throw new Error('Should have the login interaction');
    }

    const body = ctx.request.body;

    const userId = (await getUserFromUserPass(body.login, body.password)).user.id;

    if (!userId) {
      return ctx.render('login', {
        error: new Unauthorized(),
        openIDConnectEnabled,
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
      authorizedUserId: userId,
      associatedTokenId: null,
      associatedUserId: null,
      associatedKeyId: null,
      data: null
    });

    const result = {
      login: {
        accountId: userId,
      },
    };

    const interactionFinished  = await provider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: false,
    });

    return interactionFinished;
  });

  // This endpoint renders the login / consent page if needed
  router.get('/interaction/:uid', async (ctx, next) => {
    const { uid, prompt, params, session } = await provider.interactionDetails(ctx.req, ctx.res);
    const client = await provider.Client.find(params.client_id);
    const openIDConnectEnabled = getServerConfig().enableOpenIDConnect;

    switch (prompt.name) {
      case 'login': {
        return ctx.render('login', {
          error: null,
          openIDConnectEnabled,
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

  // OpenID login endpoint used as a bridge
  router.get('/oauth/:uid/login', async (ctx) => {
    // Uses the standard login function but stores the uid of the interaction in the Oauth LRU cache
    await oauthLoginEndpoint(ctx, `${provider.issuer}/oauth/callback`, ctx.request.params.uid);
  });

  // OpenID bridge callback endpoint
  router.get('/oauth/callback', async (ctx) => {
    // Uses the standard callback function but retrieves the uid of the interaction in the Oauth LRU cache
    const callbackOutput = await oauthCallbackEndpoint(ctx, `${provider.issuer}/oauth/callback`);
    // Redirect to a special post login page with the interaction uid
    ctx.redirect(`${provider.issuer}/interaction/${callbackOutput.interaction}/oauthlogin`);
  });

  // OpenID login custom post login page that extract the userId from the session cookie
  router.get('/interaction/:uid/oauthlogin', async (ctx) => {
    const session = (await sessionStore.get(ctx.cookies.get('session')));
    ctx.cookies.set('session', null);
    if (!session) { throw new Unauthorized('Unauthorized'); }

    const userId = session.userId;

    event.register({
      type: 'login',
      authorizedUserId: userId,
      associatedTokenId: null,
      associatedUserId: null,
      associatedKeyId: null,
      data: null
    });

    const result = {
      login: {
        accountId: userId,
      },
    };

    const interactionFinished  = await provider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: false,
    });

    return interactionFinished;
  });

  provider.use(router.routes());
  provider.use(cors());
  return provider.app;
}
