import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as cors from '@koa/cors';
import * as querystring from 'querystring';
import { BadRequest, Unauthorized } from 'http-errors';
import * as log from 'loglevel';
import * as Debug from 'debug';
import { SessionNotFound } from 'oidc-provider/lib/helpers/errors';
import { createSession, delSession } from '../controllers/authentication';
import { getProvider, setProviderSession } from '../controllers/oidc-provider';
import { session } from './authentication';
import { getServerConfig } from '../controllers/server-config';
import * as bodyParser from 'koa-bodyparser';
import { parse } from 'basic-auth';
import { store as event } from '../controllers/server-event';
import * as koaMount from 'koa-mount';

const debug = Debug('id:oidc:app');

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
        log.error('OIDC error', err);
        throw err;
      }
    }
  });

  provider.use(session);
  provider.use(bodyParser());

  router.post('/login', async function (ctx) {
    const body = ctx.request.body;
    if (!body.basic) {
      throw new BadRequest();
    }

    const basic = parse('Basic ' + body.basic);
    if (!basic) {
      throw new BadRequest();
    }


    const { name, pass } = basic;
    const authorization = await createSession(name, pass);
    if (!authorization) {
      throw new Unauthorized();
    }

    event.register({
      type: 'login',
      authorizedUserId: authorization.user.id,
      associatedTokenId: null,
      associatedUserId: null,
      associatedKeyId: null,
      data: null
    });
    // ctx.cookies.set('session', authorization.token, cookies.options);

    const returnTo = `https://${ctx.request.host}/oidcp/interaction/${body.grantId}/login?` + querystring.stringify({
      userId: authorization.user.id
    });
    ctx.res.statusCode = 303; // eslint-disable-line no-param-reassign
    ctx.res.setHeader('Location', returnTo);
    ctx.res.setHeader('Content-Length', '0');

    ctx.res.end();
  });

  router.get('/interaction/:uid/login', async (ctx) => {
    const { userId } = ctx.query;
    const { prompt } = await provider.interactionDetails(ctx.req, ctx.res);
    if (prompt.name !== 'login') {
      throw new Error('Should have the login interaction');
    }

    const result = {
      login: {
        accountId: userId,
      },
    };

    await setProviderSession(ctx, userId);

    // ctx.cookies.set('session', authorization.token, cookies.options);
    // ctx.body = { user: serializeUserDTO(authorization.user) };

    return provider.interactionFinished(ctx.req, ctx.res, result, {
      mergeWithLastSubmission: false,
    });
  });

  router.get('/interaction/:grant', async (ctx, next) => {
    const interactionDetails = await provider.interactionDetails(ctx.req, ctx.res);
    switch (interactionDetails.prompt.name) {
      case 'login': {
        const config = getServerConfig();
        let redirect_uri = '/auth?';
        const queryString = Object.keys(interactionDetails.params).map((key) => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(interactionDetails.params[key]);
        }).join('&');
        redirect_uri += queryString;
        const redirect = Buffer.from(redirect_uri).toString('base64');
        const origin = Buffer.from(ctx.header.referer).toString('base64');
        const grantId = interactionDetails.uid;
        // redirect to UI to login
        ctx.redirect(`${config.OIDCPInterfaceURL}/login?` + querystring.stringify({
          origin: `oidcp=${origin}`,
          redirect,
          grantId
        }));
        return;
      }
      case 'consent': {
        const { params, session: { accountId } } = interactionDetails;
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

          grant.addOIDCScope('openid email profile signature');
          grant.addOIDCClaims(['email', 'email_verified', 'name', 'nickname', 'preferred_username', 'updated_at']);
          await grant.save();
        }

        grantId = await grant.save();

        const consent: any = {};
        if (!interactionDetails.grantId) {
          // we don't have to pass grantId to consent, we're just modifying existing one
          consent.grantId = grantId;
        }

        const result = { consent };

        return provider.interactionFinished(ctx.req, ctx.res, result, {
          mergeWithLastSubmission: true,
        });
      }
      default:
        return next();
    }
  });

  router.get('/session/end', async (ctx, next) => {

    if (ctx.session) {
      await delSession(ctx.session.id);
    }
    ctx.cookies.set('session', null);
    await next();
  });

  provider.use(cors({ origin: '*' }));
  provider.use(router.routes());

  const overlay = new Koa();
  overlay.use(koaMount('/oidcp', provider.app));

  return overlay;
}
