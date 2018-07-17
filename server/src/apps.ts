import './startup';
import * as routes from './api';
import { ports } from './config';
import * as Router from "koa-router";

import * as Debug from 'debug';
const debug = Debug('id:factory');

const names = ['api', 'identity', 'signature'];

interface AppDefinition {
  name: string;
  port: number;
  router: Router;
}

interface AppMerge {
  name: string[];
  port: number;
  router: Router;
}

const dict: Dictionary<AppDefinition[]> = {};

for (const name of names) {
  const router: Router = routes[name];
  const port = ports[name];
  const app = { name, port, router };

  if (dict[port])
    dict[port].push(app);
  else
    dict[port] = [app];
}

export const apps = Object.keys(dict).reduce<AppDefinition[]>((acc, port) => {

  const apps: AppDefinition[] = dict[port];

  const app = apps.reduce<AppDefinition>((p, c) => ({
    name: p.name ? (p.name + ', ' + c.name) : c.name,
    port: p.port || c.port,
    router: p.router.use(c.router.routes())
  }), { name: '', port: 0, router: new Router() })

  return [...acc, app];
}, []);

apps.forEach(({ name, port }) => debug(`[${name}] will listen on port ${port}`));
