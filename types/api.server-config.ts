interface ServerConfig { }

interface ApiServerConfig {
  defaultKeyId: string;
  fallbackOnDefaultKey: boolean;
}

interface ApiServerConfigUpdate {
  defaultKeyId?: string;
  fallbackOnDefaultKey?: boolean;
}
