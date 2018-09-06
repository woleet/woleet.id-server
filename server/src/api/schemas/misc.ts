import * as Joi from 'joi';

export const address = Joi.string().regex(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/);
export const uuid = Joi.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
export const Word = Joi.string();
export const SafeWord = Joi.string().regex(/^[a-zA-Z][a-zA-Z0-9_]+$/);
export const DirectoryString = Joi.string().min(1).max(64);
export const AccentedWord = Joi.string().regex(/^[a-zA-ZÀ-ÿ]+$/);
export const PrintableString = Joi.string().regex(/^[a-zA-Z0-9\ \'\(\)\+\,\-\.\/\:\=\?]+$/);
export const Name = DirectoryString;
export const CountryCode = Joi.string().regex(/^[A-Z]{2}$/);
