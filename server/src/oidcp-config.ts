import * as Debug from 'debug';
const debug = Debug('id:oidcp-config');

import * as crypto from 'crypto';
import { cookies } from './config';

// https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md
export const provider = {
  acrValues: ['urn:mace:incommon:iap:bronze'],
  cookies: {
    names: {
      session: 'oidc_session',
      interaction: 'oidc_grant',
      resume: 'oidc_grant',
      state: 'oidc_state'
    },
    long: { signed: true, maxAge: (1 * 24 * 60 * 60) * 1000 }, // 1 day in ms
    short: { signed: true },
    keys: cookies.keys
  },
  discovery: {
    service_documentation: 'pkg.homepag',
    version: '1.2.3',
  },
  claims: {
    email: ['email', 'email_verified'],
    profile: ['name', 'nickname', 'preferred_username', 'updated_at'],
  },
  features: {
    devInteractions: false, // defaults to true
    discovery: true, // defaults to true
    // requestUri: true, // defaults to true
    oauthNativeApps: false, // defaults to true
    // pkce: true, // defaults to true
    // backchannelLogout: true, // defaults to false
    claimsParameter: true, // defaults to false
    // deviceFlow: true, // defaults to false
    encryption: true, // defaults to false
    // frontchannelLogout: true, // defaults to false
    introspection: true, // defaults to false
    // jwtIntrospection: true, // defaults to false
    // registration: true, // defaults to false
    // request: true, // defaults to false
    revocation: true, // defaults to false
    // sessionManagement: true, // defaults to false
    // webMessageResponseMode: true, // defaults to false
    // jwtResponseModes: true, // defaults to false
  },
  formats: {
    default: 'opaque',
    AccessToken: 'jwt',
  },
  subjectTypes: ['public', 'pairwise'],
  pairwiseIdentifier(accountId, { sectorIdentifier }) {
    return crypto.createHash('sha256')
      .update(sectorIdentifier)
      .update(accountId)
      .update('da1c442b365b563dfc121f285a11eedee5bbff7110d55c88')
      .digest('hex');
  },
  // prompts: ['none'],
  interactionUrl: function interactionUrl(ctx, interaction: Interaction) {
    // All interactions case soulhd be either disabled or contextually avoided
    throw new Error(`Unexpected interaction "${interaction.error}"`);
  },
  interactionCheck: function interactionCheck(ctx) {
    debug('INTERACTION CHECK >>>>>>', JSON.stringify(ctx.oidc, null, 2), '<<<<<<');
    if (!ctx.oidc.session.sidFor(ctx.oidc.client.clientId)) {
      return false; // TODO: IMPLEMENT THIS INTERACTION
      // return {
      //   error: 'consent_required',
      //   error_description: 'client not authorized for End-User session yet',
      //   reason: 'client_not_authorized',
      // };
    }
    // TODO: Throw error on unexpected cases
    if (
      ctx.oidc.client.applicationType === 'native'
      && ctx.oidc.params.response_type !== 'none'
      && !ctx.oidc.result) {
      return {
        error: 'interaction_required',
        error_description: 'native clients require End-User interaction',
        reason: 'native_client_prompt',
      };
    }
    const promptedScopes = ctx.oidc.session.promptedScopesFor(ctx.oidc.client.clientId);
    for (const scope of ctx.oidc.requestParamScopes) {
      if (!promptedScopes.has(scope)) {
        return {
          error: 'consent_required',
          error_description: 'requested scopes not granted by End-User',
          reason: 'scopes_missing',
        };
      }
    }
    const promptedClaims = ctx.oidc.session.promptedClaimsFor(ctx.oidc.client.clientId);
    for (const claim of ctx.oidc.requestParamClaims) {
      if (!promptedClaims.has(claim) && !['sub', 'sid', 'auth_time', 'acr', 'amr', 'iss'].includes(claim)) {
        return {
          error: 'consent_required',
          error_description: 'requested claims not granted by End-User',
          reason: 'claims_missing',
        };
      }
    }
    return false;
  },
  clientCacheDuration: 1 * 24 * 60 * 60, // 1 day in seconds,
  ttl: {
    AccessToken: 1 * 60 * 60, // 1 hour in seconds
    AuthorizationCode: 10 * 60, // 10 minutes in seconds
    IdToken: 1 * 60 * 60, // 1 hour in seconds
    DeviceCode: 10 * 60, // 10 minutes in seconds
    RefreshToken: 1 * 24 * 60 * 60, // 1 day in seconds
  }
};
