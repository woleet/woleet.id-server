import * as Joi from 'joi';
import { CountryCode, Word, DirectoryString, uuid, Name, SafeWord } from './misc';

const userRoleEnum = ['user', 'admin'];
const userStatusEnum = ['active', 'blocked'];

const createIdentity = Joi.object().keys(<DefineJoiModelAttributes<ApiIdentityObject>>{
  commonName: DirectoryString.required(),
  organization: DirectoryString.allow(null),
  organizationalUnit: DirectoryString.allow(null),
  locality: DirectoryString.allow(null),
  country: CountryCode.allow(null),
  userId: Word.min(1).max(64).allow(null)
});

const updateIdentity = Joi.object().keys(<DefineJoiModelAttributes<ApiIdentityObject>>{
  commonName: DirectoryString,
  organization: DirectoryString.allow(null),
  organizationalUnit: DirectoryString.allow(null),
  locality: DirectoryString.allow(null),
  country: CountryCode.allow(null),
  userId: Word.min(1).max(64).allow(null)
});

const createUser = Joi.object().keys(<DefineJoiModelAttributes<ApiPostUserObject>>{
  role: Joi.string().valid(userRoleEnum).allow(null),
  status: Joi.string().valid(userStatusEnum).allow(null),
  countryCallingCode: Joi.string().allow(null),
  phone: Joi.string().allow(null),
  email: Joi.string().email().allow(null), // not required for step 1 (allowing null - but should be specified)
  username: SafeWord.min(1).max(64).allow(null), // not required for step 1 (allowing null - but should be specified)
  password: Word.allow(null), // not required for step 1 (allowing null - but should be specified)
  identity: createIdentity.required(),
  sendKeyEnrolmentMail: Joi.boolean(),
  createDefaultKey: Joi.boolean(),
});

const updateUser = Joi.object().keys(<DefineJoiModelAttributes<ApiPutUserObject>>{
  role: Joi.string().valid(userRoleEnum),
  status: Joi.string().valid(userStatusEnum),
  countryCallingCode: Joi.string().allow(null),
  phone: Joi.string().allow(null),
  email: Joi.string().email().allow(null),
  username: SafeWord.min(1).max(64).allow(null),
  password: Word.allow(null),
  identity: updateIdentity,
  defaultKeyId: uuid.allow(null)
});

export { createUser, updateUser };
