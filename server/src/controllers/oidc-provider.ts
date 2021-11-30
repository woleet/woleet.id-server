/* eslint-disable no-console */

import { Provider } from 'oidc-provider';
import * as Debug from 'debug';
import { provider as providerConfiguration } from '../config.oidcp';
import { SequelizeAdapter as Adapter } from '../database/oidcp-adapter';
import { getServerConfig } from './server-config';
import { oidcKey } from '../config';
import { generateKeyPairSync, createPrivateKey } from 'crypto';
import { fromKeyLike } from 'jose/jwk/from_key_like';

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

async function getJWKS() {
  debug('getJWKS');
  let oidcPrivateKey = oidcKey;
  if (oidcPrivateKey === 'random') {
    const {publicKey, privateKey} = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {type: 'spki', format: 'pem'},
      privateKeyEncoding: {type: 'pkcs8', format: 'pem'}
    });
    oidcPrivateKey = privateKey;
  }
  return await fromKeyLike(createPrivateKey(oidcPrivateKey));
}

async function configure(): Promise<void> {
  const { enableOIDCP, OIDCPProviderURL, OIDCPClients } = getServerConfig();

  debug('Init OIDCP with:\n' + JSON.stringify({ enableOIDCP, OIDCPProviderURL }, null, 2));

  if (!enableOIDCP) {
    return abortInit('Skipping OpenID Connect Provider configuration');
  }

  if (!OIDCPProviderURL) {
    return abortInit('No OIDCPProviderURL set while OIDCP is enabled, skipping configuration');
  }

  if (!OIDCPClients || OIDCPClients.length === 0) {
    return abortInit('No OIDCPClients set while OIDCP is enabled, skipping configuration');
  }

  const clients = OIDCPClients.map((client) => Object.assign({}, client, {
    response_types: ['code'],
    grant_types: ['refresh_token', 'authorization_code']
  }));

  initialized = false;
  const adapter = Adapter;
  const jwks = await getJWKS();

  // Takes the config.oidcp.ts file and enhance it with some dynamic parameters:
  //  - Configured clients
  //  - A private RSA key formatted as jwks
  const configuration = Object.assign(
    {}, { ...{ jwks, clients }, ...providerConfiguration }
  );
  provider = new Provider(OIDCPProviderURL, { adapter, ...configuration });
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
