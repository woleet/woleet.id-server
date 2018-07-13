import * as Joi from 'joi';
import { RName, CountryCode, Word, Name } from './misc';

const userTypeEnum = ['user', 'admin'];
const userStatusEnum = ['active', 'blocked'];

const createIdentity = Joi.object().keys({
  commonName: RName,
  organization: RName,
  organizationalUnit: RName,
  locality: RName,
  country: CountryCode.required(),
  userId: Word
});

const updateIdentity = Joi.object().keys({
  commonName: Name,
  organization: Name,
  organizationalUnit: Name,
  locality: Name,
  country: CountryCode,
  userId: Word
});

const createUser = Joi.object().keys({
  type: Joi.string().valid(userTypeEnum),
  status: Joi.string().valid(userStatusEnum),
  email: Joi.string().email().allow(null), // not required for step 1 (allowing null - but should be specified)
  username: Word.allow(null), // not required for step 1 (allowing null - but should be specified)
  password: Word.allow(null), // not required for step 1 (allowing null - but should be specified)
  identity: createIdentity
});

const updateUser = Joi.object().keys({
  type: Joi.string().valid(userTypeEnum),
  status: Joi.string().valid(userStatusEnum),
  email: Joi.string().email(),
  username: Word,
  password: Word,
  identity: updateIdentity
});

export { createUser, updateUser }
