import * as Joi from 'joi';
import { Name } from './misc';
import { DefineJoiModelAttributes } from '../../types';

const apiTokenStatusEnum = ['active', 'blocked'];

const createApiToken = Joi.object().keys(<DefineJoiModelAttributes<ApiPostAPITokenObject>>{
  name: Name.required(),
  userId: Joi.string().allow(null),
  status: Joi.string().valid(apiTokenStatusEnum)
});

const updateApiToken = Joi.object().keys(<DefineJoiModelAttributes<ApiPutAPITokenObject>>{
  name: Name,
  status: Joi.string().valid(apiTokenStatusEnum)
});

export { createApiToken, updateApiToken };
