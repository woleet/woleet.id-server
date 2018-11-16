// tslint:disable:radix

import { promisify } from 'util';
import { SetOption } from 'cookies';
import * as log from 'loglevel';
import * as read from 'read';
import * as crypto from 'crypto';

function getenv(name: string, fallback = null) {
  const prefix = 'WOLEET_ID_SERVER_';
  const value = process.env[prefix + name];
  if (!value) {
    log.warn(`No value found for "${prefix + name}"${fallback ? `, defaulting to "${fallback}"` : ' !'}`);
  }
  return value || fallback;
}

export const production = getenv('PRODUCTION', 'false') === 'true';

log.setLevel(production ? 'info' : 'debug');

const defaultPort = parseInt(getenv('DEFAULT_PORT', 3000));

export const ports = {
  signature: parseInt(getenv('SIGN_PORT', defaultPort)),
  identity: parseInt(getenv('IDENTITY_PORT', defaultPort)),
  api: parseInt(getenv('API_PORT', defaultPort))
};

export const db = {
  host: getenv('POSTGRES_HOST', 'localhost'),
  database: getenv('POSTGRES_DB', 'wid'),
  username: getenv('POSTGRES_USER', 'pguser'),
  password: getenv('POSTGRES_PASSWORD', 'pass'),
  connectionAttempts: 6,
  retryDelay: 5 * 1000
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
  disable: getenv('DISABLE_EVENT_LOGGING', 'false') === 'true',
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

export const cookies: { keys: string[], options: SetOption } = {
  keys: production ? [crypto.randomBytes(16).toString('base64')] : ['cookie-devel-secret'],
  options: { secure: true, signed: true }
};

const ENCRYPTION_SECRET = getenv('ENCRYPTION_SECRET');

export const encryption = {
  secret: ENCRYPTION_SECRET,
  init: async function (): Promise<void> {
    if (!ENCRYPTION_SECRET) {
      log.warn('No WOLEET_ID_SERVER_ENCRYPTION_SECRET environment set, please enter encryption secret:');
      const options = { prompt: '>', silent: true };
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
