import * as Joi from 'joi';
import { Name } from './misc';

const apiKeyStatusEnum = ['active', 'blocked'];

const createApiKey = Joi.object().keys({
  name: Name,
  status: Joi.string().valid(apiKeyStatusEnum)
});

const updateApiKey = createApiKey;

export { createApiKey, updateApiKey }
