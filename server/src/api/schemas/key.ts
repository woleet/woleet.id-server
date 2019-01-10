import * as Joi from 'joi';
import { Name } from './misc';

const keyStatusEnum = ['active', 'blocked'];

const createKey = Joi.object().keys({
  name: Name.required(),
  status: Joi.string().valid(keyStatusEnum),
  expiration: Joi.number().allow(null)
});

const updateKey = Joi.object().keys({
  name: Name,
  status: Joi.string().valid(keyStatusEnum),
  expiration: Joi.number().allow(null)
});

export { createKey, updateKey };
