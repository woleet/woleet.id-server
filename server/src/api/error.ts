import * as Debug from 'debug';
import { IMiddleware } from "koa-router";
import { NotFound, HttpError } from "http-errors";
import { NotFoundDBObjectError, DuplicatedDBObjectError, ForeignKeyDBError, BlockedResourceError } from "../errors";

const debug = Debug('id:server');

const errorHandler: IMiddleware = async function (ctx, next) {
  try {
    await next();
    const status = ctx.status || 404;
    if (status === 404) {
      ctx.throw(new NotFound)
    }
  } catch (err) {
    debug('Handling error', err);
    if (err instanceof HttpError) {
      ctx.status = err.status;
      ctx.body = { message: err.message, status: err.status };
    } else if (err instanceof NotFoundDBObjectError) {
      ctx.status = 404;
      ctx.body = { message: err.message, status: 404 };
    } else if (err instanceof DuplicatedDBObjectError) {
      ctx.status = 409;
      ctx.body = { message: err.message, status: 409 };
    } else if (err instanceof BlockedResourceError) {
      ctx.status = 403;
      ctx.body = { message: err.message, status: 403 };
    } else if (err instanceof ForeignKeyDBError) {
      ctx.status = 400;
      ctx.body = { message: err.message, status: 400 };
    } else {
      debug('Unhandled error', err);
      ctx.status = 500;
      ctx.body = { message: 'Internal Server Error', status: 500 };
    }
  }
}

export { errorHandler };
