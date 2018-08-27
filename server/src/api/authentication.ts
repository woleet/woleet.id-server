import { Unauthorized, Forbidden } from 'http-errors';
import { store as sessionStore } from '../controllers/store.session';
import { store as apiKeyStore } from '../controllers/store.api-key';
import { Context } from 'koa';

export async function session(ctx: Context, next) {
  ctx.sessions = sessionStore;
  const sid = ctx.cookies.get('session');
  ctx.session = (sid && (await sessionStore.get(sid))) || null;
  return next();
}

export async function apiKeyAuth(ctx: Context, next) {

  const { header } = ctx.request;

  // Check if "authorization" header is set
  if (header && header.authorization) {
    const parts = header.authorization.split(' ');

    // Check if apiKey exists
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const apiKey = await apiKeyStore.get(parts[1]);

      if (apiKey && apiKey.status === 'active') {
        return next();
      }
    }
  }

  throw new Unauthorized('Invalid or missing API key');
}

export async function user(ctx: Context, next) {
  if (!ctx.session) {
    throw new Unauthorized;
  }

  return next();
}

export async function admin(ctx: Context, next) {
  if (!ctx.session) {
    throw new Unauthorized;
  }

  if (ctx.session.user.getDataValue('username') !== 'admin') {
    throw new Forbidden('Invalid user level');
  }

  return next();
}
