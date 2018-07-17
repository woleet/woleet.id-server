import { Unauthorized, Forbidden } from 'http-errors';
import { store as sessionStore } from '../controllers/store.session';
import { store as apiKeyStore } from '../controllers/store.api-key';
import { Context } from 'koa';

export async function session(ctx: Context, next) {
  ctx.sessions = sessionStore;
  const sid = ctx.cookies.get('session');
  ctx.session = (sid && (await sessionStore.get(sid))) || null;
  return next();
};

export async function user(ctx: Context, next) {
  if (!ctx.session)
    throw new Unauthorized;

  return next();
};

export async function admin(ctx: Context, next) {
  if (!ctx.session)
    throw new Unauthorized;

  if (ctx.session.user.getDataValue('username') != 'admin')
    throw new Forbidden('Invalid user level');

  return next();
};

export async function apiKeyAuth(ctx: Context, next) {



  return next();
};
