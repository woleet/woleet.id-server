import * as Joi from 'joi';
import { Name } from './misc';

const keyStatusEnum = ['active', 'blocked', 'revoked'];
const keyDeviceEnum = ['server', 'mobile', 'nano'];

const createKey = Joi.object().keys({
  name: Name.required(),
  status: Joi.string().valid(keyStatusEnum),
  expiration: Joi.number().allow(null),
  phrase: Joi.string()
});

const createExternKey = Joi.object().keys({
  name: Name.required(),
  status: Joi.string().valid(keyStatusEnum),
  expiration: Joi.number().allow(null),
  publicKey: Joi.string(),
  device: Joi.string().valid(keyDeviceEnum).allow(null)
});

const updateKey = Joi.object().keys({
  name: Name,
  status: Joi.string().valid(keyStatusEnum),
  expiration: Joi.number().allow(null),
  device: Joi.string().valid(keyDeviceEnum).allow(null)
});

export { createKey, updateKey, createExternKey };
