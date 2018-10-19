export function serialiseServerConfig(config: InternalServerConfigObject): ApiServerConfig {
  const {
    fallbackOnDefaultKey,
    defaultKeyId,
    identityURL,
    allowUserToSign,
    useOpenIDConnect,
    openIDConnectURL,
    openIDConnectClientId,
    openIDConnectClientSecret
  } = config;

  return {
    fallbackOnDefaultKey,
    defaultKeyId,
    identityURL,
    allowUserToSign,
    useOpenIDConnect,
    openIDConnectURL,
    openIDConnectClientId,
    openIDConnectClientSecret
  };
}
