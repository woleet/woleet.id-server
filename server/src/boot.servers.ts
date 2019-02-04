import * as log from 'loglevel';

import { cookies, ports, server as config } from './config';
// API servers dependencies
import * as Koa from 'koa';
import * as morgan from 'koa-morgan';
import * as cors from '@koa/cors';
import { errorHandler } from './api/error';

import { build as oidcProviderAppFactory } from './api/oidcp-app';
import {
  getActiveServer,
  isInitialized as isOIDCPInitialized,
  setActiveServer,
  stopOIDCProvider
} from './controllers/oidc-provider';
import { definitions } from './apps';
import { exit } from './exit';

import { createServer, ServerOptions } from 'https';
import { Server } from 'net';

import { setServerConfig } from './controllers/server-config';

const apps: Dictionary<Server> = {};

function startServer(app, port): Server {
  let server = null;

  app.keys = cookies.keys;

  if (config.proxy) {
    log.warn('Server configured to trust proxy');
    app.proxy = true;
  }

  if (config.cert && config.key) {
    log.info('Using TLS');

    const { key, cert } = config;

    const options: ServerOptions = { key, cert };

    server = createServer(options, app.callback());

    server.listen(port);
  } else {
    server = app.listen(port);
  }

  return server;
}

function startSMTPServer(options, port): Server {
  let server = null;

  options.key = config.key;
  options.cert = config.cert;
  options.secure = false;
  options.authOptional = true;

  if (config.proxy) {
    log.warn('Server configured to trust proxy');
    options.proxy = true;
  }

  const SMTPServer = require('smtp-server').SMTPServer;

  server = new SMTPServer(options);
  server.listen(port);

  return server;
}

export function bootServers(): Promise<void> {
  log.info('Starting servers...');

  const promises = definitions.map(({ name, port, router }) => {

    return new Promise<void>((resolve) => {

      log.info(`Starting ${name} server(s) on port ${port}...`);

      const app = new Koa();

      app.use((ctx, next) => {
        if (!ctx.secure) {
          const forwardedProto = ctx.get('x-forwarded-proto');
          if (!forwardedProto) {
            log.warn(`x-forwarded-proto header not detected, please configure your proxy to do so.`);
          } else if (forwardedProto !== 'https') {
            log.warn(`x-forwarded-proto header is set to ${forwardedProto}, please configure your proxy to use SSL.`);
          }
        }
        return next();
      });

      app.use(errorHandler);
      app.use(morgan('dev'));
      app.use(cors({ credentials: true })); // TODO:
      app.use(router.routes());

      const server = startServer(app, port);

      server.on('error', (err) => exit(`Server ${name} encountered an error: ${err.message}`, err));

      server.on('listening', () => {
        log.info(`[${name.split('-').join(', ')}] listening on port ${port}.`);
        resolve();
      });

      apps[name] = server;

    });

  });

  const oidc = bootOIDCProvider();

  const smtp = bootSMTPServer();

  return Promise.all(promises.concat(oidc).concat(smtp)).then(() => { });
}

export async function bootOIDCProvider(): Promise<void> {
  const port = ports.oidcp;

  const activeServer: Server = getActiveServer();

  if (activeServer) {
    await stopOIDCProvider();
  }

  await new Promise((resolve) => {
    if (isOIDCPInitialized()) {
      log.info(`Starting OIDCP server on port ${port}...`);

      let resolved = false;
      const app = oidcProviderAppFactory();

      const server = startServer(app, port);

      setActiveServer(server);

      server.on('listening', () => {
        log.info(`OIDCP server listening on port ${port}.`);
        resolved = true;
        resolve();
      });

      server.on('error', (err) => {
        log.error('OIDCP server encountered an error, it will be disabled as a precaution! Please check your configuration');
        if (resolved) {
          return exit(`Open ID Connect Provider's server encountered an error: ${err.message}`, err);
        } else {
          // disable
          log.warn('OIDCP server encountered an error before listening, it will be softly disabled');
          log.warn('Full trace is:', err);
          setActiveServer(null);
          setServerConfig({ enableOIDCP: false }).then(resolve);
        }
      });
    } else {
      resolve();
    }
  });
}

export async function bootSMTPServer(): Promise<void> {
  const port = ports.smtp;

  await new Promise((resolve) => {
    log.info(`SMTP server listening on port ${port}.`);

    const server = startSMTPServer({}, port);

    server.on('listening', () => {
      log.info(`SMTP server listening on port ${port}.`);
      resolve();
    });
    server.on('error', (err) => {
      return exit(`SMTP server encountered an error: ${err.message}`, err);
    });
  });
}
