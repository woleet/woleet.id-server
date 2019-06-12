import { IMiddleware } from 'koa-router';
import { HttpError, NotFound } from 'http-errors';
import * as errors from '../errors';
import { store as event } from '../controllers/server-event';
import * as log from 'loglevel';

const errorHandler: IMiddleware = async function (ctx, next) {
  try {
    await next();
    const status = ctx.status || 404;
    if (status === 404) {
      ctx.throw(new NotFound);
    }
  } catch (err) {

    if (err instanceof HttpError) {
      ctx.status = err.status;
      ctx.body = { message: err.message, status: err.status };
    } else if (err instanceof errors.NotFoundDBObjectError) {
      ctx.status = 404;
      ctx.body = { message: err.message, status: 404 };
    } else if (err instanceof errors.DuplicatedDBObjectError) {
      ctx.status = 409;
      ctx.body = { message: err.message, status: 409 };
    } else if (err instanceof errors.BlockedResourceError) {
      ctx.status = 403;
      ctx.body = { message: err.message, status: 403 };
    } else if (err instanceof errors.NoDefaultKeyError) {
      ctx.status = 403;
      ctx.body = { message: err.message, status: 403 };
    } else if (err instanceof errors.ForeignKeyDBError) {
      ctx.status = 400;
      ctx.body = { message: err.message, status: 400 };
    } else if (err instanceof errors.KeyOwnerMismatchError) {
      ctx.status = 400;
      ctx.body = { message: err.message, status: 400 };
    } else if (err instanceof errors.ServerNotReadyError) {
      ctx.status = 202;
      ctx.body = { message: err.message, status: 202 };
    } else {
      log.error('Unhandled error:', err.message);
      log.error('Stack:', err.stack);

      event.register({
        type: 'error',
        authorizedUserId: ctx.session && ctx.session.user && ctx.session.user.get('id'),
        associatedTokenId: null,
        associatedUserId: null,
        associatedKeyId: null,
        data: { message: err.message, stack: err.stack }
      });

      ctx.status = 500;
      ctx.body = { message: 'Internal server error', status: 500 };
    }
  }
};

export { errorHandler };
