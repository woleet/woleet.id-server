import { cookies } from "./config";
import { OIDCAccount } from "./database/oidcp-adapter";

// https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md
export const provider: any = {
  acrValues: ['urn:mace:incommon:iap:bronze'],
  interactions: {
    url(ctx, interaction) { // eslint-disable-line no-unused-vars
      return `/interaction/${interaction.uid}`;
    },
  },
  findAccount: OIDCAccount.findAccount,
  cookies: {
    keys: cookies.keys,
    names: {
      interaction: '_oidcp_interaction',
      resume: '_oidcp_interaction_resume',
      session: '_oidcp_session'
    }
  },
  claims: {
    email: ['email', 'email_verified'],
    profile: ['name', 'nickname', 'preferred_username', 'updated_at'],
  },
  pkce: {
    required: function pkceRequired(ctx, client) {
      return false;
    }
  },
  features: {
    devInteractions: { enabled: false }, // defaults to true
    claimsParameter: { enabled: true },  // defaults to false
    encryption: { enabled: true },       // defaults to false
    introspection: { enabled: true },    // defaults to false
    revocation: { enabled: true }       // defaults to false
  },
  // https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#scopes
  scopes: ['openid', 'offline_access', 'signature'],
  subjectTypes: ['public', 'pairwise'],
  responseTypes: ['code'],
  ttl: {
    AccessToken: 1 * 60 * 60, // 1 hour in seconds
    AuthorizationCode: 10 * 60, // 10 minutes in seconds
    IdToken: 1 * 60 * 60, // 1 hour in seconds
    DeviceCode: 10 * 60, // 10 minutes in seconds
    RefreshToken: 1 * 24 * 60 * 60, // 1 day in seconds
    Interaction: 1 * 60 * 60, // 1 hour in seconds
    Session: 1 * 60 * 60 * 24, // 1 day in seconds
  },
  renderError: async function renderError(ctx, out, error) {
    ctx.type = 'html';
    ctx.body = `<!DOCTYPE html>
      <head>
        <title>oops! something went wrong</title>
        <style>/* css and html classes omitted for brevity, see lib/helpers/defaults.js */</style>
      </head>
      <body>
        <div>
          <h1>oops! something went wrong</h1>
          ${Object.entries(out).map(([key, value]) => `<pre><strong>${key}</strong>: ${value}</pre>`).join('')}
        </div>
        <div>
        <h1>
          ${error}
        </h1>
        </div>
      </body>
      </html>`;
  }
};
