

/*
export default async function (ctx: Context, next) {
  ctx.sessions = store;
  const { header } = ctx.request;
  if (header && header.authorization) {
    const parts = header.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      const sid = parts[1];
      ctx.session = (await store.get(sid)) || null;
    } else {
      throw new BadRequest('Invalid token');
    }
  }

  return next();
};
 */
