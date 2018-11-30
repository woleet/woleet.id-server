import { Unauthorized, Forbidden } from 'http-errors';
import { store as sessionStore } from '../controllers/store.session';
import { store as apiTokenStore } from '../controllers/store.api-token';
import { store as oauthAccessTokenStore } from '../controllers/store.oauth-token';
import { Context } from 'koa';

export async function session(ctx: Context, next) {
  ctx.sessions = sessionStore;
  const sid = ctx.cookies.get('session');
  ctx.session = (sid && (await sessionStore.get(sid))) || null;
  return next();
}

export async function bearerAuth(ctx: Context, next) {

  const { header } = ctx.request;

  // Check if "authorization" header is set
  if (header && header.authorization) {
    const parts = header.authorization.split(' ');

    // Check if apiToken exists
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const token: InternalTokenObject = (await apiTokenStore.get(parts[1])) || (await oauthAccessTokenStore.get(parts[1]));

      if (token) {
        ctx.token = token;


        if (token) {
          switch (token.status) {
            case 'active':
              return next();
            case 'expired':
              throw new Unauthorized('Token expired');
            case 'blocked':
              throw new Unauthorized('Token blocked');
          }
        }
      }

      throw new Unauthorized('Invalid token');
    }
  }

  throw new Unauthorized('Missing token');
}

export async function user(ctx: Context, next) {
  if (!(ctx.session && ctx.session.user)) {
    throw new Unauthorized();
  }

  return next();
}

export async function admin(ctx: Context, next) {
  if (!(ctx.session && ctx.session.user)) {
    throw new Unauthorized();
  }

  if (ctx.session.user.getDataValue('role') !== 'admin') {
    throw new Forbidden('Invalid user level');
  }

  return next();
}
