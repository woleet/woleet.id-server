interface ServerConfig {
}

type uri = string;

interface ApiOIDCPClient {
  token_endpoint_auth_method: string,
  client_id: string,
  client_secret: string,
  redirect_uris: uri[],
  post_logout_redirect_uris: uri[]
}

interface ApiServerConfig {
  identityURL: string;
  signatureURL?: string;
  APIURL?: string;
  defaultKeyId: string;
  fallbackOnDefaultKey: boolean;
  allowUserToSign: boolean;
  logoURL?: string | null;
  HTMLFrame?: string | null;

  // Open ID Connect config
  enableOpenIDConnect: boolean;
  openIDConnectURL: string | null;
  openIDConnectClientId: string | null;
  openIDConnectClientSecret: string | null;
  openIDConnectClientRedirectURL: string | null;

  // Open ID Connect Provider config
  OIDCPInterfaceURL: string | null;
  OIDCPProviderURL: string | null;
  OIDCPIssuerURL: string | null;
  OIDCPClients: ApiOIDCPClient[] | null;
  enableOIDCP: boolean;

  enrollmentExpirationOffset?: string;
  keyExpirationOffset?: string;

  // SMTP config
  enableSMTP: boolean;
  SMTPConfig: string | null;
  webClientURL: string | null;

  // Mail template
  mailResetPasswordTemplate: string | null;
  mailOnboardingTemplate: string | null;
  mailKeyEnrollmentTemplate: string | null;

  // Admin contact
  contact: string | null;

  organizationName: string | null;

  // ProofDesk config
  proofDeskAPIURL: string | null;
  proofDeskAPIToken: string | null;
  enableProofDesk: boolean | null;

  // Block Password input for admin
  blockPasswordInput: boolean | null;

  // Block password reset for user
  askForResetInput: boolean | null;

  // Block identity endpoint without signed identity query
  preventIdentityExposure: boolean | null;

  // Configuration errors
  oidcError?: string | null;
  oidcpError?: string | null;
  smtpError?: string | null;
  proofDeskError?: string | null;
}

interface ApiServerConfigUpdate {
  identityURL?: string;
  signatureURL?: string;
  APIURL?: string;
  defaultKeyId?: string;
  logoURL?: string;
  HTMLFrame?: string;
  fallbackOnDefaultKey?: boolean;
  allowUserToSign?: boolean;

  // Open ID Connect config
  enableOpenIDConnect?: boolean;
  openIDConnectURL?: string;
  openIDConnectClientId?: string;
  openIDConnectClientSecret?: string;
  openIDConnectClientRedirectURL?: string;

  // Open ID Connect Provider config
  OIDCPInterfaceURL?: string;
  OIDCPProviderURL?: string;
  OIDCPIssuerURL?: string;
  OIDCPClients?: ApiOIDCPClient[];
  enableOIDCP?: boolean;

  enrollmentExpirationOffset?: string;
  keyExpirationOffset?: string;

  // SMTP config
  enableSMTP?: boolean;
  SMTPConfig?: string;
  webClientURL?: string;

  // Mail template
  mailResetPasswordTemplate?: string;
  mailOnboardingTemplate?: string;
  mailKeyEnrollmentTemplate?: string;

  // Admin contact
  contact?: string;

  organizationName?: string;

  // ProofDesk config
  proofDeskAPIURL?: string;
  proofDeskAPIToken?: string;
  enableProofDesk?: boolean;

  // Block Password input for admin
  blockPasswordInput?: boolean;

  // Block password reset for user
  askForResetInput?: boolean;

  // Block identity endpoint without signed identity query
  preventIdentityExposure?: boolean;
}
