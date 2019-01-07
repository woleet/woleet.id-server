/* tslint-env mocha */
/* tslint prefer-arrow-callback: "off" */
/* tslint import/no-extraneous-dependencies: "off" */

import 'mocha';

import { agent, SuperTest, Test } from 'supertest';
import * as Koa from 'koa';
import * as Router from 'koa-router';

import { api, identity, signature } from '../src/api';
import { errorHandler } from '../src/api/error';
import { createServer } from 'http';

declare interface Definition { router: Router; }
declare interface Definitions { api: Definition; identity: Definition; signature: Definition; allInOne: Definition; }
declare interface Agent extends SuperTest<Test> { }
declare interface Agents { api: Agent; identity: Agent; signature: Agent; allInOne: Agent; }

const definitions: Definitions = {
  api: { router: (new Router()).use(api.routes()) },
  identity: { router: (new Router()).use(identity.routes()) },
  signature: { router: (new Router()).use(signature.routes()) },
  allInOne: { router: (new Router()).use(api.routes()).use(identity.routes()).use(signature.routes()) }
};

export const agents: Agents = Object
  .keys(definitions)
  .reduce<any>((acc, name) => {
    const app = new Koa();
    app.use(errorHandler);
    app.use(definitions[name].router.routes());
    acc[name] = agent(createServer(app.callback()));
    return acc;
  }, {});

export default agents;
