// tslint:disable:radix

import * as log from 'loglevel';
import * as assert from 'assert';

function getenv(name: string) {
  const prefix = 'WOLEET_ID_SERVER_';
  return process.env[prefix + name];
}

export const production = getenv('PRODUCTION') === 'true';

log.setLevel(production ? 'info' : 'debug');

const defaultPort = parseInt(getenv('DEFAULT_PORT')) || 3000;

export const ports = {
  signature: parseInt(getenv('SIGNATURE_PORT')) || defaultPort,
  identity: parseInt(getenv('IDENTITY_PORT')) || defaultPort,
  api: parseInt(getenv('API_PORT')) || defaultPort
};

export const db = {
  host: getenv('POSTGRES_HOST') || 'localhost',
  database: getenv('POSTGRES_DB') || 'wid',
  username: getenv('POSTGRES_USER') || 'pguser',
  password: getenv('POSTGRES_PASSWORD') || 'pass'
};

export const session = {
  expireAfter: 30 * 60 * 1000,
  maxAge: 24 * 60 * 60 * 1000
};

export const server = {
  protocol: 'http',
  host: '127.0.0.1'
};

export const pagination = {
  default: {
    offset: undefined,
    limit: undefined
  }
};

export const events = {
  disable: getenv('DISABLE_EVENT_LOGGING') === 'true' || false,
  batchSize: 100,
  flushAfter: 10 * 1000,
  typesEnum: [
    'error',
    'signature', 'login', 'config.edit',
    'key.create', 'key.edit', 'key.delete',
    'user.create', 'user.edit', 'user.delete',
    'token.create', 'token.edit', 'token.delete'
  ]
};

export const serverConfig = {
  default: {
    identityURL: `${server.protocol}://${server.host}:${ports.identity}/identity`,
    fallbackOnDefaultKey: true
  },
  CONFIG_ID: 'SERVER-CONFIG'
};



// TODO: must not default
const defaultSecret = 'secret';
const ENCRYPTION_SECRET = getenv('ENCRYPTION_SECRET');
if (!ENCRYPTION_SECRET) {
  log.warn('No "WOLEET_ID_SERVER_ENCRYPTION_SECRET" environment set...');
  if (production) {
    assert(ENCRYPTION_SECRET, '"WOLEET_ID_SERVER_ENCRYPTION_SECRET" is not set');
  }
  log.warn(`...defaulting to "${defaultSecret}"`);
}

export const encryption = {
  secret: ENCRYPTION_SECRET || defaultSecret
};
