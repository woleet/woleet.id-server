import { IMiddleware } from 'koa-router';
import { HttpError, NotFound } from 'http-errors';
import * as errors from '../errors';
import * as log from 'loglevel';
import { serverEventLogger } from '../config';

const errorHandler: IMiddleware = async function (ctx, next) {
  try {
    await next();
    const status = ctx.status || 404;
    if (status === 404) {
      ctx.throw(new NotFound);
    }
  } catch (error) {

    if (error instanceof HttpError) {
      ctx.status = error.status;
      ctx.body = { name: error.name, message: error.message, status: error.status };
    } else if (error instanceof errors.NotFoundDBObjectError) {
      ctx.status = 404;
      ctx.body = { name: error.name, message: error.message, status: 404 };
    } else if (error instanceof errors.DuplicatedDBObjectError) {
      ctx.status = 409;
      ctx.body = { name: error.name, message: error.message, status: 409 };
    } else if (error instanceof errors.BlockedResourceError) {
      ctx.status = 403;
      ctx.body = { name: error.name, message: error.message, status: 403 };
    } else if (error instanceof errors.ForbiddenResourceError) {
      ctx.status = 403;
      ctx.body = { name: error.name, message: error.message, status: 403 };
    } else if (error instanceof errors.NoDefaultKeyError) {
      ctx.status = 403;
      ctx.body = { name: error.name, message: error.message, status: 403 };
    } else if (error instanceof errors.ForeignKeyDBError) {
      ctx.status = 400;
      ctx.body = { name: error.name, message: error.message, status: 400 };
    } else if (error instanceof errors.KeyOwnerMismatchError) {
      ctx.status = 400;
      ctx.body = { name: error.name, message: error.message, status: 400 };
    } else if (error instanceof errors.APITokenOwnerMismatchError) {
      ctx.status = 403;
      ctx.body = { name: error.name, message: error.message, status: 403 };
    } else if (error instanceof errors.ServerNotReadyError) {
      ctx.status = 202;
      ctx.body = { name: error.name, message: error.message, status: 202 };
    } else {
      log.error('Unhandled error:', error.message);
      log.error('Stack:', error.stack);

      serverEventLogger.error({
        type: 'error',
        authorizedUserId: ctx.authorizedUser && ctx.authorizedUser.userId ? ctx.authorizedUser.userId : null,
        associatedTokenId: null,
        associatedUserId: null,
        associatedKeyId: null,
        data: { name: error.name, message: error.message, stack: error.stack }
      });

      ctx.status = 500;
      ctx.body = { message: 'Internal server error', status: 500 };
    }
  }
};

export { errorHandler };
