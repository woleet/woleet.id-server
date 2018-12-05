export function serializeServerConfig(config: InternalServerConfigObject): ApiServerConfig {
  const {
    fallbackOnDefaultKey,
    defaultKeyId,
    identityURL,
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
    OIDCPClients
  } = config;

  return {
    fallbackOnDefaultKey,
    defaultKeyId,
    identityURL,
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
    OIDCPClients
  };
}
