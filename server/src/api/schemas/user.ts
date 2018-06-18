import * as Joi from 'joi';

const userTypeEnum = ['user', 'admin'];
const userStatusEnum = ['active', 'locked', 'disabled'];

const Word = Joi.string().alphanum().min(3).max(30);
const RWord = Word.required();

const createUser = Joi.object().keys({
  type: Joi.string().valid(userTypeEnum),
  status: Joi.string().valid(userStatusEnum),
  email: Joi.string().email(),
  username: RWord,
  firstName: RWord,
  lastName: RWord,
  password: Joi.string()
});

const updateUser = Joi.object().keys({
  type: Joi.string().valid(userTypeEnum),
  status: Joi.string().valid(userStatusEnum),
  email: Joi.string().email(),
  username: Word,
  firstName: Word,
  lastName: Word,
  password: Joi.string()
});

export { createUser, updateUser }
