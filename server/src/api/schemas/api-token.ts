import * as Joi from 'joi';
import { Name } from './misc';

const apiTokenStatusEnum = ['active', 'blocked'];

const createApiToken = Joi.object().keys({
  name: Name,
  status: Joi.string().valid(apiTokenStatusEnum)
});

const updateApiToken = createApiToken;

export { createApiToken, updateApiToken };
