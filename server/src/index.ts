import * as Debug from 'debug';

import * as Koa from 'koa';
import * as morgan from 'koa-morgan';
import * as cors from '@koa/cors';

import { apps as definitions } from './apps';
import { errorHandler } from './api/error';
import { Server } from 'http';

const debug = Debug('id:server');

export const apps: Dictionary<Server> = {};

definitions.map(({ name, port, router }) => {

  const app = new Koa();

  app.use(errorHandler);
  app.use(morgan('dev'));
  app.use(cors({ credentials: true }));
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
