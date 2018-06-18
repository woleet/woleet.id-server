import { Request, Response, NextFunction } from "express";

import * as keySchemas from './key';
import * as userSchemas from './user';
import { ObjectSchema } from 'joi';
import { BadRequestError } from "http-typed-errors/lib";

const schemas: { [id: string]: ObjectSchema } = (<any>Object).assign({},
  keySchemas,
  userSchemas
);

function validate(schema: string) {

  const _schema = schemas[schema];

  if (!_schema)
    throw new Error(`Cannot find "${schema}" schema`);

  return function (req: Request, res: Response, next: NextFunction) {
    _schema.validate(req.body, (error) => {
      if (!error)
        return next()

      throw new BadRequestError(error.message);
    })
  }
}

export { schemas, validate };
