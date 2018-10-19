import * as Joi from 'joi';
import { Name } from './misc';

const apiTokenStatusEnum = ['active', 'blocked'];

const createApiToken = Joi.object().keys(<DefineJoiModelAttributes<ApiPostAPITokenObject>>{
  name: Name.required(),
  status: Joi.string().valid(apiTokenStatusEnum)
});

const updateApiToken =  Joi.object().keys(<DefineJoiModelAttributes<ApiPostAPITokenObject>>{
  name: Name,
  status: Joi.string().valid(apiTokenStatusEnum)
});

export { createApiToken, updateApiToken };
