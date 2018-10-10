import * as Debug from 'debug';

import * as Koa from 'koa';
import * as cors from '@koa/cors';
import * as morgan from 'koa-morgan';

import { apps as definitions } from './apps';
import { errorHandler } from './api/error';
import { production } from './config';
import { Server } from 'http';

const debug = Debug('id:server');

export const apps: Dictionary<Server> = {};

definitions.map(({ name, port, router }) => {

  const app = new Koa();

  app.use(errorHandler);

  // We need to allow at least the OPTIONS methods
  // to let the request go through the other routers
  if (!production) {
    app.use(cors({ credentials: true }));
  } else if (name.split('-').includes('identity')) {
    app.use(cors({ allowMethods: ['OPTIONS'] }));
  }

  app.use(morgan('dev'));
  app.use(router.routes());

  const server = app.listen(port);

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = `[${name}] on port ${port}`;
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.on('listening', () => debug(`[${name}] listening on ${port}`));

  apps[name] = server;

});
