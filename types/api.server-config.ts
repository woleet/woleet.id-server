interface ServerConfig { }

interface ApiServerConfig {
  identityUrl: string;
  defaultKeyId: string;
  fallbackOnDefaultKey: boolean;
}

interface ApiServerConfigUpdate {
  identityUrl?: string;
  defaultKeyId?: string;
  fallbackOnDefaultKey?: boolean;
}
