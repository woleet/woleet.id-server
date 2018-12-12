// tslint:disable:radix

import { promisify } from 'util';
import { SetOption } from 'cookies';
import { readFileSync } from 'fs';
import * as log from 'loglevel';
import * as read from 'read';
import * as crypto from 'crypto';
import * as assert from 'assert';
import * as chalk from 'chalk';

// Logger setup

const originalFactory = log.methodFactory;
// @ts-ignore-next-line
log.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);
  const colors = { trace: 'grey', debug: 'cyan', info: 'green', warn: 'yellow', error: 'red' };

  return function () {
    const level = chalk[colors[methodName]].bold(`[${methodName}]`);
    const date = new Date().toISOString();
    rawMethod.apply(log, [`${date} ${level}`].concat(...arguments));
  };
};

function getenv<T = string>(name: string, fallback: T = null): T {
  const prefix = 'WOLEET_ID_SERVER_';
  const value = process.env[prefix + name];
  if (!value && fallback !== null) {
    log.warn(`No value found for "${prefix + name}"${fallback !== null ? `, defaulting to '${JSON.stringify(fallback)}'` : ' !'}`);
  }
  if (fallback !== null) {
    switch (typeof fallback) {
      case 'boolean':
        return <any>(value ? value === 'true' : fallback);
      case 'number':
        return <any>(parseInt(value) || fallback);
    }
  }
  return <any>(value || fallback);
}

export const production = getenv('PRODUCTION', true);

log.setLevel(production ? 'info' : 'debug');

log[production ? 'info' : 'warn'](
  `Running server in ${chalk.bold(production ? chalk.green('PRODUCTION') : chalk.red('DEVELOPMENT'))} mode`
);

const defaultPort = getenv('DEFAULT_PORT', 3000);

export const ports = {
  oidcp: (getenv('OIDCP_PORT', 3003)),
  signature: (getenv('SIGN_PORT', defaultPort)),
  identity: (getenv('IDENTITY_PORT', defaultPort)),
  api: (getenv('API_PORT', defaultPort))
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

const certPath = getenv('HTTP_TLS_CERTIFICATE');
const keyPath = getenv('HTTP_TLS_KEY');

// If certificate but no key OR key but no certificate
assert((!!certPath) === (!!keyPath), '"HTTP_TLS_CERTIFICATE" cannot be provided without "HTTP_TLS_KEY" and vice versa');

export const server = {
  protocol: 'https',
  host: getenv('HOST', 'localhost'),
  proxy: getenv('BEHIND_PROXY', false),
  cert: certPath && readFileSync(certPath),
  key: keyPath && readFileSync(keyPath)
};

export const pagination = {
  default: {
    offset: undefined,
    limit: undefined
  }
};

export const events = {
  disable: getenv('DISABLE_EVENT_LOGGING', false),
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
  keys: [crypto.randomBytes(16).toString('base64')],
  options: {
    secure: <boolean>production === true,
    signed: <boolean>production === true
  }
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
