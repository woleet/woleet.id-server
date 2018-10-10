import './startup';
import * as routes from './api';
import { ports } from './config';
import * as Router from 'koa-router';

import * as Debug from 'debug';
const debug = Debug('id:factory');

const names = ['signature', 'identity', 'api'];

interface AppDefinition {
  name: string;
  port: number;
  router: Router;
}

const defs: Dictionary<AppDefinition[]> = {};

for (const name of names) {
  const router: Router = routes[name];
  const port = ports[name];
  const app = { name, port, router };

  if (defs[port]) {
    defs[port].push(app);
  } else {
    defs[port] = [app];
  }
}

export const apps = Object.keys(defs).reduce<AppDefinition[]>((acc, port) => {

  const _apps: AppDefinition[] = defs[port];

  const app = _apps.reduce<AppDefinition>((_acc, _app) => ({
    name: _acc.name ? _acc.name + '-' + _app.name : _app.name,
    port: _acc.port || _app.port,
    router: _acc.router.use(_app.router.routes())
  }), { name: '', port: 0, router: new Router() });

  return [...acc, app];
}, []);

apps.forEach(({ name, port }) => debug(`[${name}] will listen on port ${port}`));
