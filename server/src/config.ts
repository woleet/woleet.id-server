// tslint:disable:radix

import * as log from 'loglevel';

const env = process.env;

log.setLevel(env.PROD === 'true' ? 'info' : 'debug');

const defaultPort = parseInt(env.WOLEET_ID_SERVER_DEFAULT_PORT) || 3000;

export const ports = {
  signature: parseInt(env.WOLEET_ID_SERVER_SIGNATURE_PORT) || defaultPort,
  identity: parseInt(env.WOLEET_ID_SERVER_IDENTITY_PORT) || defaultPort,
  api: parseInt(env.WOLEET_ID_SERVER_API_PORT) || defaultPort
};

export const db = {
  host: env.POSTGRES_HOST || 'localhost',
  database: env.POSTGRES_DB || 'wid',
  username: env.POSTGRES_USER || 'pguser',
  password: env.POSTGRES_PASSWORD || 'pass'
};

export const session = {
  expireAfter: 30 * 60 * 1000,
  maxAge: 24 * 60 * 60 * 1000
};

export const server = {
  protocol: 'http',
  host: '127.0.0.1'
};

export default { ports, db, session, server };
