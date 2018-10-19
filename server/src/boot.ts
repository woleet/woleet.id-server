import * as Debug from 'debug';
import * as log from 'loglevel';

import { Server } from 'http';
import { randomBytes } from 'crypto';
import { Key } from './database';
import { createUser } from './controllers/user';
import { setServerConfig, loadServerConfig } from './controllers/server-config';

const debug = Debug('id:boot');

// API servers dependencies
import * as Koa from 'koa';
import * as morgan from 'koa-morgan';
import * as cors from '@koa/cors';

import { apps as definitions } from './apps';
import { errorHandler } from './api/error';

export const apps: Dictionary<Server> = {};

// Config
import { encryption } from './config';
import { setSecret } from './controllers/utils/encryption';
import { initPromise } from './database';
import { signMessage } from './controllers/sign';
import { configure as initOpenIDConnect } from './controllers/openid';

function exit(msg) {
  log.error(msg);
  process.exit(1);
}

initPromise
  .then(() => encryption.init())
  .then(() => {
    setSecret(encryption.secret);
    log.info('Secret successfully initialized.');
  })
  .catch((err) => exit(`Failed to init secret: ${err.message}`))
  .then(() => loadServerConfig())
  .then(async (config) => {
    if (config) {
      log.info(`Server configuration successfully restored: \n${JSON.stringify(config, null, 2)}`);

      const key = await Key.getAny();

      if (!key) {
        log.warn('Not any key in database, cannot check secret restoration');
        return;
      }

      try {
        await signMessage(key.get('privateKey'), randomBytes(32).toString('hex'), key.get('compressed'));
      } catch (err) {
        log.warn(err.message);
        throw new Error('Secret is not the same that the previously set one');
      }

    } else {
      log.warn('No configuration found in database, creating a new one along with a default admin user...');
      debug('Creating an admin user');
      let admin;
      try {
        admin = await createUser({
          password: 'pass',
          role: 'admin',
          username: 'admin',
          identity: {
            commonName: 'Admin',
            userId: 'admin'
          }
        });
      } catch (err) {
        return exit(`Failed to create user "admin": ${err.message}`);
      }

      log.info(`Created user "admin" with id ${admin.id}`);

      const conf = await setServerConfig({ defaultKeyId: admin.defaultKeyId });
      log.info(`Created new server configuration with defaults: ${JSON.stringify(conf, null, 2)}`);
    }
  })
  .catch((err) => exit(`Failed to load server config: ${err.message}`))
  .then(async () => {
    try {
      await initOpenIDConnect();
      return;
    } catch (err) {
      log.error('Failed to initalize OPenID Connect, it will be automatically disabled !', err);
    }
    return setServerConfig({ useOpenIDConnect: false });
  })
  .catch((err) => exit(`Failed to update server config: ${err.message}`))
  .then(() => {
    log.info(`Starting servers...`);

    definitions.map(({ name, port, router }) => {
      log.info(`Starting ${name} server(s) on port ${port}...`);

      const app = new Koa();

      app.use(errorHandler);
      app.use(morgan('dev'));
      app.use(cors({ credentials: true }));
      app.use(router.routes());

      const server = app.listen(port);

      server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.syscall !== 'listen') {
          return exit(`Unknwon error: ${err.message}`);
        }
        const bind = `[${name}] on port ${port}`;
        switch (err.code) {
          case 'EACCES':
            return exit(`${bind} requires elevated privileges`);
          case 'EADDRINUSE':
            return exit(`${bind} is already in use`);
          default:
            return exit(`Unknwon server error: ${err.message}`);
        }
      });

      server.on('listening', () => debug(`[${name}] listening on ${port}`));

      apps[name] = server;

    });

  })
  .catch((err) => exit(`Failed to start server: ${err.message}`))
  .then(() => log.info('All done. You can now detach the CLI (ctrl+c)'))
  ;
