interface ServerConfig { }

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
  defaultKeyId: string;
  fallbackOnDefaultKey: boolean;
  allowUserToSign: boolean;
  publicInfo: {
    logoURL?: string | null;
    HTMLFrame?: string | null;
  }
  // Open ID Connect config
  useOpenIDConnect: boolean;
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
  keyExpirationOffset?: string;

  // SMTP config
  useSMTP: boolean;
  SMTPConfig: string | null;
  ServerClientURL: string | null;

  // Mail template
  mailResetPasswordTemplate: string | null;
  mailOnboardingTemplate: string | null;
  mailKeyEnrolmentTemplate:string | null;

}

interface ApiServerConfigUpdate {
  identityURL?: string;
  defaultKeyId?: string;
  publicInfo?: {
    logoURL?: string;
    HTMLFrame?: string;
  }
  fallbackOnDefaultKey?: boolean;
  allowUserToSign?: boolean;

  // Open ID Connect config
  useOpenIDConnect?: boolean;
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
  keyExpirationOffset?: string;

  // SMTP config
  useSMTP?: boolean;
  SMTPConfig?: string;
  ServerClientURL?: string;

  // Mail template
  mailResetPasswordTemplate?: string;
  mailOnboardingTemplate?: string;
  mailKeyEnrolmentTemplate?:string;
}
