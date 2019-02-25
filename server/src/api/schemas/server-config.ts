import * as Joi from 'joi';
import { uuid } from './misc';

const oidcpClient = Joi.object().keys(<DefineJoiModelAttributes<ApiOIDCPClient>>{
  token_endpoint_auth_method: Joi.string().min(1),
  client_id: Joi.string().min(1),
  client_secret: Joi.string().min(1),
  redirect_uris: Joi.array().items(Joi.string().uri({ scheme: ['https'] }))
});

const updateConfig = Joi.object().keys(<DefineJoiModelAttributes<ApiServerConfig>>{
  identityURL: Joi.string().uri({ scheme: ['http', 'https'] }),
  defaultKeyId: uuid,
  fallbackOnDefaultKey: Joi.boolean(),
  allowUserToSign: Joi.boolean(),
  useOpenIDConnect: Joi.boolean(),
  openIDConnectURL: Joi.string().uri({ scheme: ['https'] }).allow(null),
  openIDConnectClientId: Joi.string().allow(null),
  openIDConnectClientSecret: Joi.string().allow(null),
  openIDConnectClientRedirectURL: Joi.string().uri({ scheme: ['https'] }).allow(null),
  // OIDCP config
  enableOIDCP: Joi.boolean(),
  OIDCPInterfaceURL: Joi.string().uri({ scheme: ['https'] }).allow(null),
  OIDCPProviderURL: Joi.string().uri({ scheme: ['https'] }).allow(null),
  OIDCPIssuerURL: Joi.string().uri({ scheme: ['https'] }).allow(null),
  OIDCPClients: Joi.array().items(oidcpClient).allow(null),
  keyExpirationOffset: Joi.string().allow(null),
  // SMTP config
  useSMTP: Joi.boolean(),
  SMTPConfig: Joi.string().allow(null),
});

export { updateConfig };
