import { Unauthorized, Forbidden } from 'http-errors';
import { Context } from 'koa';

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
