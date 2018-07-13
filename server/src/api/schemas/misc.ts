import * as Joi from 'joi';

export const uuid = Joi.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
export const Word = Joi.string().regex(/^[a-z0-9]{3,30}$/i);
export const Name = Joi.string().regex(/^[a-z0-9 \-]{3,30}$/i);
export const RWord = Word.required();
export const RName = Name.required();
export const CountryCode = Joi.string().regex(/^[A-Z]{2}$/);
