interface ServerConfig { }

type uri = string;

interface ApiOIDCPClient {
  client_id: string,
  client_secret: string,
  redirect_uris: uri[],
}

interface ApiServerConfig {
  identityURL: string;
  defaultKeyId: string;
  fallbackOnDefaultKey: boolean;
  allowUserToSign: boolean;
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
}

interface ApiServerConfigUpdate {
  identityURL?: string;
  defaultKeyId?: string;
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
}
