interface ServerConfig { }

interface ApiServerConfig {
  identityURL: string;
  defaultKeyId: string;
  fallbackOnDefaultKey: boolean;
  allowUserToSign: boolean;
  useOpenIDConnect: boolean;
  openIDConnectURL: string | null;
  openIDConnectClientId: string | null;
  openIDConnectClientSecret: string | null;
}

interface ApiServerConfigUpdate {
  identityURL?: string;
  defaultKeyId?: string;
  fallbackOnDefaultKey?: boolean;
  allowUserToSign?: boolean;
  useOpenIDConnect?: boolean;
  openIDConnectURL?: string;
  openIDConnectClientId?: string;
  openIDConnectClientSecret?: string;
}
