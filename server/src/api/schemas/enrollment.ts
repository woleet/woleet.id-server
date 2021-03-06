import * as Joi from 'joi';
import { Name } from './misc';

const keyDeviceEnum = ['server', 'mobile', 'nano'];

const createEnrollment = Joi.object().keys({
  name: Name.required(),
  expiration: Joi.number().allow(null),
  userId: Joi.string().required(),
  device: Joi.string().valid(keyDeviceEnum).allow(null),
  test: Joi.boolean().allow(null),
  keyExpiration: Joi.number().allow(null),
});

export { createEnrollment };
