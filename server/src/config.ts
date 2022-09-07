import { SetOption } from 'cookies';
import * as fs from 'fs';
import { readFileSync } from 'fs';
import  *  as  winston  from  'winston';
import  'winston-daily-rotate-file';
import * as path from 'path';
import * as log from 'loglevel';
import * as crypto from 'crypto';
import * as assert from 'assert';
import * as chalk from 'chalk';

import { SecureModule } from '@woleet/woleet-secure-module';

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

const prefix = 'WOLEET_ID_SERVER_';

export const secretEnvVariableName = prefix + 'ENCRYPTION_SECRET';
const dockerSwarmSecretFile = 'encryption_secret';
const dockerSwarmSecretFilePath = path.join(__dirname, dockerSwarmSecretFile);

if (fs.existsSync(dockerSwarmSecretFilePath)) {
  process.env[secretEnvVariableName] = fs.readFileSync(dockerSwarmSecretFilePath, 'utf8').split(/[\r\n]+/)[0];
}

function getenv<T = string>(name: string, fallback: T = null): T {
  const value = process.env[prefix + name];
  if (!value && fallback !== null) {
    log.warn(`No value found for '${prefix + name}', defaulting to '${JSON.stringify(fallback)}'`);
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
  // @ts-ignore
  `Running server in ${chalk.bold(production ? chalk.green('PRODUCTION') : chalk.red('DEVELOPMENT'))} mode`
);

export const ports = {
  api: (getenv('API_PORT', 3000)),
  identity: (getenv('IDENTITY_PORT', 3001)),
  signature: (getenv('SIGNATURE_PORT', 3002)),
  oidcp: (getenv('OIDCP_PORT', 3003))
};

export const db = {
  host: getenv('POSTGRES_HOST', 'localhost'),
  port: parseInt(getenv('POSTGRES_PORT', '5432')),
  database: getenv('POSTGRES_DB', 'wid'),
  username: getenv('POSTGRES_USER', 'pguser'),
  password: getenv('POSTGRES_PASSWORD', 'pass'),
  connectionAttempts: 6,
  retryDelay: 5 * 1000
};

export const cacheConfig = {
  type: getenv('CACHE_TYPE', 'local'), // For, now there is only 'local' or 'redis' as options
  host: getenv('REDIS_HOST', 'localhost'),
  port: getenv('REDIS_PORT', 6379)
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

export const events = {
  disable: getenv('DISABLE_EVENT_LOGGING', false),
  batchSize: 100,
  flushAfter: 10 * 1000,
  typesEnum: [
    'error',
    'signature', 'login', 'config.edit',
    'enrollment.create', 'enrollment.delete', 'enrollment.edit',
    'key.create', 'key.edit', 'key.delete',
    'enrollment.create-signature-request',
    'user.create', 'user.edit', 'user.delete',
    'token.create', 'token.edit', 'token.delete',
  ]
};

export const serverConfig = {
  default: {
    version: 17, // data model version
    identityURL: `${server.protocol}://${server.host}:${ports.identity}/identity`,
    preventIdentityExposure: true, // identity URL contract V2 is activated by default on a fresh server
    signatureURL: `${server.protocol}://${server.host}:${ports.signature}`,
    organizationName: 'Woleet',
    mailOnboardingTemplate: readFileSync(
      path.join(__dirname, '../assets/defaultOnboardingMailTemplate.html'), { encoding: 'ascii' }),
    mailResetPasswordTemplate: readFileSync(
      path.join(__dirname, '../assets/defaultPasswordResetMailTemplate.html'), { encoding: 'ascii' }),
    mailKeyEnrollmentTemplate: readFileSync(
      path.join(__dirname, '../assets/defaultKeyEnrollmentMailTemplate.html'), { encoding: 'ascii' })
  },
  CONFIG_ID: 'SERVER-CONFIG'
};

export const cookies: { keys: string[], options: SetOption } = {
  keys: [getenv('COOKIE_KEY', crypto.randomBytes(16).toString('base64'))],
  options: {
    secure: <boolean>production === true,
    signed: <boolean>production === true
  }
};

// A pem certificate can be provided to the underlying OIDC provider,
// it is mandatory to provide one when using multiple Woleet.ID servers
// It can be generated by: `openssl genrsa 2048`
export const oidcKey = getenv('OIDC_KEY', 'random');

export const secureModule = new SecureModule;

const serverEventTransport = new winston.transports.DailyRotateFile({
  filename: 'server-event-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  frequency: '1d',
  dirname: getenv('LOG_DIRNAME', '.'),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  )
});

// Winston logger
export const serverEventLogger = winston.createLogger({
  transports: [
    serverEventTransport
  ]
});
