import * as Joi from 'joi';
import { uuid } from './misc';

const oidcpClient = Joi.object().keys(<DefineJoiModelAttributes<ApiOIDCPClient>>{
  token_endpoint_auth_method: Joi.string().min(1),
  client_id: Joi.string().min(1),
  client_secret: Joi.string().min(1),
  redirect_uris: Joi.array().items(Joi.string().uri({ scheme: ['https'] })),
  post_logout_redirect_uris: Joi.array().items(Joi.string().uri({ scheme: ['https'] }).allow(''))
});

const updateConfig = Joi.object().keys(<DefineJoiModelAttributes<ApiServerConfig>>{
  identityURL: Joi.string().uri({ scheme: ['http', 'https'] }),
  defaultKeyId: uuid,
  fallbackOnDefaultKey: Joi.boolean(),
  allowUserToSign: Joi.boolean(),
  publicInfo: Joi.object({
    logoURL: Joi.string().uri({ scheme: ['http', 'https'] }).allow(null),
    HTMLFrame: Joi.string().allow(null),
  }),
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
  ServerClientURL: Joi.string().uri({ scheme: ['https'] }).allow(null),
  // Mail template
  mailResetPasswordTemplate: Joi.string().allow(null),
  mailOnboardingTemplate: Joi.string().allow(null),
  mailKeyEnrolmentTemplate: Joi.string().allow(null),
  TCU: Joi.object({
    data: Joi.string().allow(null),
    name: Joi.string().allow(null),
  }).allow(null),
  contact: Joi.string().allow(null)
  // ProofDesk config
  proofDeskAPIURL: Joi.string().uri({ scheme: ['https'] }).allow(null),
  proofDeskAPIToken: Joi.string().allow(null),
  proofDeskAPIIsValid: Joi.number().allow(null)
});

export { updateConfig };
