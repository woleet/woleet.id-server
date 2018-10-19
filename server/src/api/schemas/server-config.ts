import * as Joi from 'joi';
import { uuid } from './misc';

const updateConfig = Joi.object().keys(<DefineJoiModelAttributes<ApiServerConfig>>{
  identityURL: Joi.string().uri({ scheme: ['http', 'https'] }),
  defaultKeyId: uuid,
  fallbackOnDefaultKey: Joi.boolean(),
  allowUserToSign: Joi.boolean(),
  useOpenIDConnect: Joi.boolean(),
  openIDConnectURL: Joi.string().uri({ scheme: ['https'] }).allow(null),
  openIDConnectClientId: Joi.string().allow(null),
  openIDConnectClientSecret: Joi.string().allow(null)
});

export { updateConfig };
