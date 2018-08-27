import * as Joi from 'joi';
import { Name } from './misc';

const keyStatusEnum = ['active', 'blocked'];

const createKey = Joi.object().keys({
  name: Name,
  status: Joi.string().valid(keyStatusEnum)
});

const updateKey = createKey;

export { createKey, updateKey };
