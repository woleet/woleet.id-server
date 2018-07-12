import * as Joi from 'joi';

const keyStatusEnum = ['active', 'blocked'];

const addKey = Joi.object().keys({
  name: Joi.string().alphanum().min(3).max(30).required(),
  status: Joi.string().valid(keyStatusEnum)
});

const updateKey = addKey;

export { addKey, updateKey }
