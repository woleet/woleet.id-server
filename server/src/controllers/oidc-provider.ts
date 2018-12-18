/* eslint-disable no-console */

import * as OIDCProvider from 'oidc-provider';
import * as Debug from 'debug';

const debug = Debug('id:oidcp');

import { provider as providerConfiguration } from '../config.oidcp';
import { OIDCAccount as Account, SequelizeAdapter as Adapter } from '../database/oidcp-adapter';
import { getServerConfig } from './server-config';

import * as log from 'loglevel';

let server = null;
let provider = null;
let initialized = false;

export function getProvider() {
  if (!initialized) {
    throw new Error('Provider not initialized !');
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
  const keystore = OIDCProvider.createKeyStore();

  await Promise.all([
    keystore.generate('RSA', 2048, { alg: 'RS256', use: 'sig' }),
    keystore.generate('EC', 'P-256', { kid: 'enc-ec2-0', use: 'sig' })
  ]);

  return keystore;
})();

async function configure(): Promise<void> {
  const { enableOIDCP, OIDCPInterfaceURL, OIDCPIssuerURL, OIDCPClients } = getServerConfig();
  const keystore = await keystorePromise;

  debug('Init OIDCP with:\n' + JSON.stringify({ enableOIDCP, OIDCPInterfaceURL, OIDCPIssuerURL }, null, 2));

  if (!enableOIDCP) {
    return abortInit('enableOIDCP=false, skipping configuration');
  }

  if (!OIDCPIssuerURL) {
    return abortInit('No OIDCPIssuerURL set while Open ID Connect is enabled, skipping configuration');
  }

  if (!OIDCPClients || OIDCPClients.length === 0) {
    return abortInit('No OIDCPClients set while Open ID Connect is enabled, skipping configuration');
  }

  if (!OIDCPInterfaceURL) {
    return abortInit('No OIDCPInterfaceURL set while Open ID Connect is enabled, skipping configuration');
  }

  const clients = OIDCPClients.map((client) => Object.assign({}, client, { grant_types: ['refresh_token', 'authorization_code'] }));

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
      log.info(`Shutting down OIDCP server...`);
      server.close(() => {
        log.info(`OIDCP server is now down`);
        setActiveServer(null);
        resolve();
      });
    } else {
      log.info(`Nothing to do, OIDCP server is already down.`);
      resolve();
    }
  });
}

export function setProviderSession(ctx, userId) {
  if (initialized && provider) {
    return provider.setProviderSession(ctx.req, ctx.res, { account: userId });
  }
}
