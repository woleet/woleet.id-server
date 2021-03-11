/* eslint-disable no-console */

import * as OIDCProvider from 'oidc-provider';
import * as Debug from 'debug';
import { provider as providerConfiguration } from '../config.oidcp';
import { OIDCAccount as Account, SequelizeAdapter as Adapter } from '../database/oidcp-adapter';
import { getServerConfig } from './server-config';
import { oidcKey } from '../config';

import * as log from 'loglevel';

const debug = Debug('id:oidcp');

let server = null;
let provider = null;
let initialized = false;

export function getProvider() {
  if (!initialized) {
    throw new Error('Provider not initialized!');
  }
  return provider;
}

export function isInitialized() {
  return initialized;
}

function abortInit(message): void {
  initialized = false;
  log.warn(message);
  provider = null;
}

// https://github.com/panva/node-oidc-provider/blob/master/docs/keystores.md#generating-all-keys-for-all-features
const keystorePromise = (async () => {
  let keystore;

  if (oidcKey != "random") {
    await Promise.all([
      OIDCProvider.asKey(oidcKey, "pem").then(function(result) {
        keystore = result.keystore;
      })]);
  } else {
    keystore = OIDCProvider.createKeyStore();
    await Promise.all([
      keystore.generate('RSA', 2048, { alg: 'RS256', use: 'sig' })
    ]);
  }

  return keystore;
})();

async function configure(): Promise<void> {
  const { enableOIDCP, OIDCPInterfaceURL, OIDCPIssuerURL, OIDCPClients } = getServerConfig();
  const keystore = await keystorePromise;

  debug('Init OIDCP with:\n' + JSON.stringify({ enableOIDCP, OIDCPInterfaceURL, OIDCPIssuerURL }, null, 2));

  if (!enableOIDCP) {
    return abortInit('Skipping OpenID Connect Provider configuration');
  }

  if (!OIDCPIssuerURL) {
    return abortInit('No OIDCPIssuerURL set while OIDCP is enabled, skipping configuration');
  }

  if (!OIDCPClients || OIDCPClients.length === 0) {
    return abortInit('No OIDCPClients set while OIDCP is enabled, skipping configuration');
  }

  if (!OIDCPInterfaceURL) {
    return abortInit('No OIDCPInterfaceURL set while OIDCP is enabled, skipping configuration');
  }

  const clients = OIDCPClients.map((client) => Object.assign({}, client, {
    response_types: ['code'],
    grant_types: ['refresh_token', 'authorization_code']
  }));

  initialized = false;
  provider = new OIDCProvider(OIDCPIssuerURL, Object.assign({}, providerConfiguration, { findById: Account.findById }));
  await provider.initialize({ adapter: Adapter, clients, keystore });
  initialized = true;
}

export function initializeOIDCProvider() {
  return configure();
}

export function updateOIDCProvider() {
  return configure();
}

export function setActiveServer(s) {
  if (s && server) {
    throw new Error('Attempt to override server value');
  }
  server = s;
}

export function getActiveServer() {
  return server;
}

export function stopOIDCProvider(): Promise<void> {
  return new Promise((resolve) => {
    if (server) {
      log.info('Shutting down OIDCP server...');
      server.close(() => {
        log.info('OIDCP server is now down');
        setActiveServer(null);
        resolve();
      });
    } else {
      log.info('Nothing to do, OIDCP server is already down');
      resolve();
    }
  });
}

export function setProviderSession(ctx, userId) {
  if (initialized && provider) {
    return provider.setProviderSession(ctx.req, ctx.res, { account: userId });
  }
}
