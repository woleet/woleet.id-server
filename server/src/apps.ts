import * as routes from './api';
import { ports } from './config';
import * as Router from 'koa-router';

import * as Debug from 'debug';

const debug = Debug('id:factory');

const names = ['signature', 'identity', 'api'];

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

export const definitions = Object.keys(defs).reduce<AppDefinition[]>((acc, port) => {

  const apps: AppDefinition[] = defs[port];

  const app = apps.reduce<AppDefinition>((_acc, _app) => ({
    name: _acc.name ? _acc.name + '-' + _app.name : _app.name,
    port: _acc.port || _app.port,
    router: _acc.router.use(_app.router.routes())
  }), { name: '', port: 0, router: new Router() });

  return [...acc, app];
}, []);

definitions.forEach(({ name, port }) => debug(`[${name}] will listen on port ${port}`));
