import { store } from '../ctr/session';
import { BadRequest } from 'http-errors';

export default async function (ctx, next) {
  ctx.sessions = store;
  const { header } = ctx.request;
  if (header && header.authorization) {
    const parts = header.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const sid = parts[1];
      ctx.session = await store.get(sid);
    } else {
      throw new BadRequest('Invalid token');
    }
  }

  return next();
};
