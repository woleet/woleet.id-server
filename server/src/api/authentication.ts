import { Forbidden, Unauthorized } from 'http-errors';
import { store as sessionStore } from '../controllers/store.session';
import { store as apiTokenStore } from '../controllers/store.api-token';
import { store as oauthAccessTokenStore } from '../controllers/store.oauth-token';
import { getUserById } from '../controllers/user';
import { isInitialized } from '../controllers/oidc-provider';
import { Context } from 'koa';
import { InternalTokenObject, InternalUserObject } from '../types';

export async function session(ctx: Context, next) {
  ctx.sessions = sessionStore;
  const sid = ctx.cookies.get('session');
  ctx.session = (sid && (await sessionStore.get(sid))) || null;
  if (ctx.session) {
    ctx.authorizedUser = {
      userId: ctx.session.userId,
      userRole: ctx.session.userRole
    };
  }
  return next();
}

export async function token(ctx: Context, next) {
  const { header } = ctx.request;

  // Check if "authorization" header is set
  if (header && header.authorization) {
    const parts = header.authorization.split(' ');

    // Check if API token exists
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const tokenObject: InternalTokenObject = await apiTokenStore.getByValue(parts[1]);
      if (tokenObject) {
        if (tokenObject.status === 'expired') {
          throw new Unauthorized('Expired token');
        }
        if (tokenObject.status === 'blocked') {
          throw new Unauthorized('Blocked token');
        }
        ctx.token = tokenObject;
        if (tokenObject.userId) {
          const userObject: InternalUserObject = await getUserById(tokenObject.userId);
          ctx.authorizedUser = {
            userId: userObject.id,
            userRole: userObject.role
          };
        }
        return next();
      }
      throw new Unauthorized('Invalid token');
    }
  }
  return next();
}

export async function bearerAuth(ctx: Context, next) {
  const { header } = ctx.request;

  // Check if "authorization" header is set
  if (header && header.authorization) {
    const parts = header.authorization.split(' ');

    // Check if API token exists
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const tokenObject: InternalTokenObject = await apiTokenStore.getByValue(parts[1])
        || (isInitialized() && await oauthAccessTokenStore.get(parts[1]));
      if (tokenObject) {
        ctx.token = tokenObject;
        if (tokenObject) {
          if (!tokenObject.scope.includes('signature')) {
            throw new Unauthorized('Missing signature scope');
          }

          if (tokenObject.userId) {
            if (ctx.query.userId && ctx.query.userId !== tokenObject.userId) {
              throw new Unauthorized('Mismatch userId');
            }
          }

          switch (tokenObject.status) {
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
  if (!(ctx.session && ctx.session.userId) && !(ctx.token)) {
    throw new Unauthorized();
  }

  return next();
}

export async function admin(ctx: Context, next) {
  if (!(ctx.session && ctx.session.userId) && !(ctx.token)) {
    throw new Unauthorized();
  }

  if (ctx.authorizedUser && ctx.authorizedUser.userRole !== 'admin' || (ctx.token && ctx.token.role !== 'admin')) {
    throw new Forbidden('Invalid user level');
  }

  return next();
}

export async function manager(ctx: Context, next) {
  if (!(ctx.session && ctx.session.userId) && !(ctx.token)) {
    throw new Unauthorized();
  }

  if (ctx.authorizedUser && ctx.authorizedUser.userRole !== 'admin' && ctx.authorizedUser.userRole !== 'manager'
    && !(ctx.token && ctx.token.role === 'admin')) {
    throw new Forbidden('Invalid user level');
  }

  return next();
}
