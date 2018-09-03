import * as Joi from 'joi';
import { RName, CountryCode, Word, DirectoryString, uuid } from './misc';

const userRoleEnum = ['user', 'admin'];
const userStatusEnum = ['active', 'blocked'];

const createIdentity = Joi.object().keys({
  commonName: RName,
  organization: DirectoryString,
  organizationalUnit: DirectoryString,
  locality: DirectoryString,
  country: CountryCode,
  userId: Word.min(1).max(64)
});

const updateIdentity = Joi.object().keys({
  commonName: DirectoryString,
  organization: DirectoryString.allow(null),
  organizationalUnit: DirectoryString.allow(null),
  locality: DirectoryString.allow(null),
  country: CountryCode.allow(null),
  userId: Word.min(1).max(64).allow(null)
});

const createUser = Joi.object().keys({
  role: Joi.string().valid(userRoleEnum),
  status: Joi.string().valid(userStatusEnum),
  email: Joi.string().email().allow(null), // not required for step 1 (allowing null - but should be specified)
  username: Word.allow(null), // not required for step 1 (allowing null - but should be specified)
  password: Word.allow(null), // not required for step 1 (allowing null - but should be specified)
  identity: createIdentity.required()
});

const updateUser = Joi.object().keys({
  role: Joi.string().valid(userRoleEnum),
  status: Joi.string().valid(userStatusEnum),
  email: Joi.string().email().allow(null),
  username: Word.allow(null),
  password: Word.allow(null),
  identity: updateIdentity,
  defaultKeyId: uuid.allow(null)
});

export { createUser, updateUser };
