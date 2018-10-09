// tslint:disable:radix

import { promisify } from 'util';
import * as log from 'loglevel';
import * as read from 'read';

function getenv(name: string) {
  const prefix = 'WOLEET_ID_SERVER_';
  return process.env[prefix + name];
}

const prod = getenv('PROD') === 'true';

log.setLevel(prod ? 'info' : 'debug');

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

const ENCRYPTION_SECRET = env.ENCRYPTION_SECRET;

export const encryption = {
  secret: ENCRYPTION_SECRET,
  init: async function (): Promise<void> {
    if (!ENCRYPTION_SECRET) {
      log.warn('No "ENCRYPTION_SECRET" environment set, please type encryption secret:');
      const options = { silent: true };
      const _read = promisify(read);
      let secret = '';
      while (!secret) {
        secret = await _read(options);
        if (!secret) {
          log.warn('Encryption secret must not be empty, please type it:');
        }
        encryption.secret = secret;
      }
    }
  }
};
