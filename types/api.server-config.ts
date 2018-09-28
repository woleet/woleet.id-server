interface ServerConfig { }

interface ApiServerConfig {
  identityURL: string;
  defaultKeyId: string;
  fallbackOnDefaultKey: boolean;
}

interface ApiServerConfigUpdate {
  identityURL?: string;
  defaultKeyId?: string;
  fallbackOnDefaultKey?: boolean;
}
