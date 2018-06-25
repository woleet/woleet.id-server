import { ObjectSchema } from 'joi';
import { BadRequest } from "http-errors";
import { IMiddleware } from 'koa-router';

import * as keySchemas from './key';
import * as userSchemas from './user';
import * as miscSchemas from './misc';

const schemas: { [id: string]: ObjectSchema } = (<any>Object).assign({},
  keySchemas,
  userSchemas,
  miscSchemas
);

function validateBody(schema: string): IMiddleware {

  const _schema = schemas[schema];

  // Thrown at initialization.
  if (!_schema)
    throw new Error(`Cannot find "${schema}" schema`);

  return async function (ctx, next) {
    try {
      await _schema.validate(ctx.request.body)
      return next();
    } catch (error) {
      throw new BadRequest(error.message);
    }
  }
}

function validateParam(name: string, schema: string): IMiddleware {

  const _schema = schemas[schema];

  // Thrown at initialization.
  if (!_schema)
    throw new Error(`Cannot find "${schema}" schema`);

  return async function (ctx, next) {
    const param = ctx.params[name];
    if (!param)
      throw new BadRequest(`Path variable "${name}" is missing`);

    try {
      await _schema.validate(param)
      return next();
    } catch (error) {
      throw new BadRequest(error.message);
    }
  }
}

const validate = { param: validateParam, body: validateBody };

export { schemas, validate };
