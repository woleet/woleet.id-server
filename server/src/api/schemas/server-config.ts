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
  signatureURL: Joi.string().uri({ scheme: ['http', 'https'] }),
  APIURL: Joi.string().uri({ scheme: ['http', 'https'] }).allow(null),
  defaultKeyId: uuid,
  fallbackOnDefaultKey: Joi.boolean(),
  allowUserToSign: Joi.boolean(),
  logoURL: Joi.string().uri({ scheme: ['http', 'https'] }).allow(null),
  HTMLFrame: Joi.string().allow(null),
  enableOpenIDConnect: Joi.boolean(),
  openIDConnectURL: Joi.string().uri({ scheme: ['https'] }).allow(null),
  openIDConnectClientId: Joi.string().allow(null),
  openIDConnectClientSecret: Joi.string().allow(null),
  openIDConnectClientRedirectURL: Joi.string().uri({ scheme: ['https'] }).allow(null),

  // OIDCP config
  enableOIDCP: Joi.boolean(),
  OIDCPProviderURL: Joi.string().uri({ scheme: ['https'] }).allow(null),
  OIDCPClients: Joi.array().items(oidcpClient).allow(null),
  keyExpirationOffset: Joi.string().allow(null),
  enrollmentExpirationOffset: Joi.string().allow(null),

  // SMTP config
  enableSMTP: Joi.boolean(),
  SMTPConfig: Joi.string().allow(null),
  webClientURL: Joi.string().uri({ scheme: ['https'] }).allow(null),

  // Mail template
  mailResetPasswordTemplate: Joi.string().allow(null),
  mailOnboardingTemplate: Joi.string().allow(null),
  mailKeyEnrollmentTemplate: Joi.string().allow(null),
  contact: Joi.string().allow(null),
  organizationName: Joi.string().allow(null),

  // ProofDesk config
  proofDeskAPIURL: Joi.string().uri({ scheme: ['https'] }).allow(null),
  proofDeskAPIToken: Joi.string().allow(null),
  enableProofDesk: Joi.boolean().allow(null),

  // Block Password input for admin
  blockPasswordInput: Joi.boolean().allow(null),

  // Block password reset for user
  askForResetInput: Joi.boolean().allow(null),

  // Block identity endpoint without signed identity query
  preventIdentityExposure: Joi.boolean().allow(null)
});

export { updateConfig };
