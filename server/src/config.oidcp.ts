import { cookies, sessionSuffix } from './config';

// https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md
export const provider = {
  acrValues: ['urn:mace:incommon:iap:bronze'],
  cookies: {
    names: {
      session: 'oidc-session' + sessionSuffix,
      interaction: 'oidc-grant' + sessionSuffix,
      resume: 'oidc-grant' + sessionSuffix,
      state: 'oidc-state' + sessionSuffix
    },
    long: { signed: true, secure: true, maxAge: (1 * 24 * 60 * 60) * 1000 }, // 1 day in ms
    short: { signed: true, secure: true },
    keys: cookies.keys
  },
  claims: {
    email: ['email', 'email_verified'],
    profile: ['name', 'nickname', 'preferred_username', 'updated_at'],
  },
  features: {
    devInteractions: false, // defaults to true
    discovery: true,        // defaults to true
    oauthNativeApps: false, // defaults to true
    claimsParameter: true,  // defaults to false
    encryption: true,       // defaults to false
    introspection: true,    // defaults to false
    revocation: true,       // defaults to false
    sessionManagement: true // defaults to false
  },
  formats: {
    default: 'opaque'
  },
  // https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#scopes
  scopes: ['openid', 'offline_access', 'signature'],
  subjectTypes: ['public', 'pairwise'],
  interactionUrl: function interactionUrl(ctx, interaction: Interaction) {
    // All interactions case should be either disabled or contextually avoided
    throw new Error(`Unexpected interaction "${interaction.error}"`);
  },
  interactionCheck: function interactionCheck(ctx) {
    if (!ctx.oidc.session.sidFor(ctx.oidc.client.clientId)) {
      return false; // TODO: IMPLEMENT THIS INTERACTION // #skipped-authorize-interaction // WOLEET-881
    }

    throw new Error('Interaction should not be asked: ' + JSON.stringify(ctx.oidc, null, 2));
  },
  responseTypes: ['code'],
  clientCacheDuration: 1 * 24 * 60 * 60, // 1 day in seconds,
  ttl: {
    AccessToken: 1 * 60 * 60, // 1 hour in seconds
    AuthorizationCode: 10 * 60, // 10 minutes in seconds
    IdToken: 1 * 60 * 60, // 1 hour in seconds
    DeviceCode: 10 * 60, // 10 minutes in seconds
    RefreshToken: 1 * 24 * 60 * 60, // 1 day in seconds
  }
};
