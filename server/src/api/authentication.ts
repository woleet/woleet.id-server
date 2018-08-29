import { Unauthorized, Forbidden } from 'http-errors';
import { store as sessionStore } from '../controllers/store.session';
import { store as apiTokenStore } from '../controllers/store.api-token';
import { Context } from 'koa';

export async function session(ctx: Context, next) {
  ctx.sessions = sessionStore;
  const sid = ctx.cookies.get('session');
  ctx.session = (sid && (await sessionStore.get(sid))) || null;
  return next();
}

export async function apiTokenAuth(ctx: Context, next) {

  console.warn('HEADER');
  const { header } = ctx.request;

  console.log('HEADER' ,{ header })

  // Check if "authorization" header is set
  if (header && header.authorization) {
    const parts = header.authorization.split(' ');

    console.log({ parts })
    // Check if apiToken exists
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const apiToken = await apiTokenStore.get(parts[1]);

      if (apiToken && apiToken.status === 'active') {
        return next();
      }
    }
  }

  throw new Unauthorized('Invalid or missing API token');
}

export async function user(ctx: Context, next) {
  if (!ctx.session) {
    throw new Unauthorized('a');
  }

  return next();
}

export async function admin(ctx: Context, next) {
  if (!ctx.session) {
    throw new Unauthorized('b');
  }

  if (ctx.session.user.getDataValue('username') !== 'admin') {
    throw new Forbidden('Invalid user level');
  }

  return next();
}
