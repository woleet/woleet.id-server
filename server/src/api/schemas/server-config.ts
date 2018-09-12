import * as Joi from 'joi';
import { uuid } from './misc';

const updateConfig = Joi.object().keys({
  defaultKeyId: uuid,
  fallbackOnDefaultKey: Joi.boolean()
});

export { updateConfig };
