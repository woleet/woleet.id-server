import { IMiddleware } from "koa-router";
import { NotFound, HttpError } from "http-errors";

const errorHandler: IMiddleware = async function(ctx, next) {
  try {
    await next();
    const status = ctx.status || 404;
    if (status === 404) {
      ctx.throw(new NotFound)
    }
  } catch (err) {
    if (err instanceof HttpError) {
      ctx.status = err.status;
      ctx.body = { message: err.message, status: err.status };
    } else {
      console.error('Unhandled error', err);
      ctx.status = 500;
      ctx.body = { message: 'Internal Server Error', status: 500 };
    }
  }
}

export { errorHandler };
