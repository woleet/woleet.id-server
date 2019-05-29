export function serializeServerConfig(config: InternalServerConfigObject): ApiServerConfig {
  const {
    fallbackOnDefaultKey,
    defaultKeyId,
    identityURL,
    publicInfo,
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
    keyExpirationOffset,
    enrollmentExpirationOffset,
    useSMTP,
    SMTPConfig,
    webClientURL,
    mailResetPasswordTemplate,
    mailOnboardingTemplate,
    mailKeyEnrollmentTemplate,
    TCU,
    contact,
    organizationName,
    proofDeskAPIURL,
    proofDeskAPIToken,
    proofDeskAPIIsValid
  } = config;

  return {
    fallbackOnDefaultKey,
    defaultKeyId,
    identityURL,
    publicInfo,
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
    keyExpirationOffset,
    enrollmentExpirationOffset,
    useSMTP,
    SMTPConfig,
    webClientURL,
    mailResetPasswordTemplate,
    mailOnboardingTemplate,
    mailKeyEnrollmentTemplate,
    TCU,
    contact,
    organizationName,
    proofDeskAPIURL,
    proofDeskAPIToken,
    proofDeskAPIIsValid
  };
}
