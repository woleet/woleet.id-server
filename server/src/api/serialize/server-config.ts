export function serializeServerConfig(config: InternalServerConfigObject): ApiServerConfig {
  const {
    fallbackOnDefaultKey,
    defaultKeyId,
    identityURL,
    logoURL,
    HTMLFrameURL,
    allowUserToSign,
    useOpenIDConnect,
    openIDConnectURL,
    openIDConnectClientId,
    openIDConnectClientSecret,
    openIDConnectClientRedirectURL,
    enableOIDCP,
    OIDCPInterfaceURL,
    OIDCPProviderURL,
    OIDCPIssuerURL,
    OIDCPClients,
    keyExpirationOffset
  } = config;

  return {
    fallbackOnDefaultKey,
    defaultKeyId,
    identityURL,
    logoURL,
    HTMLFrameURL,
    allowUserToSign,
    useOpenIDConnect,
    openIDConnectURL,
    openIDConnectClientId,
    openIDConnectClientSecret,
    openIDConnectClientRedirectURL,
    enableOIDCP,
    OIDCPInterfaceURL,
    OIDCPProviderURL,
    OIDCPIssuerURL,
    OIDCPClients,
    keyExpirationOffset
  };
}
