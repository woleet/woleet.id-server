import * as Joi from 'joi';
import { uuid } from './misc';

const updateConfig = Joi.object().keys({
  identityUrl: Joi.string().uri({ scheme: ['http', 'https'] }),
  defaultKeyId: uuid,
  fallbackOnDefaultKey: Joi.boolean()
});

export { updateConfig };
