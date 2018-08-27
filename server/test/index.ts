/* tslint-env mocha */
/* tslint prefer-arrow-callback: "off" */
/* tslint import/no-extraneous-dependencies: "off" */

import 'mocha';
import 'chai-http';

import * as chai from 'chai';
import { expect } from 'chai';

chai.use(require('chai-http'));
chai.should();

import { apps } from '../src/apps';

const app = apps.values()[0];

let server = null;

before((done) => {
  server = app.listen(3000, () => console.log('Opened server'));
  setTimeout(done, 1000);
});

after((done) => {
  server.close((() => {
    console.log('Closed server');
    done();
  }));
});

export const request = () => chai.request(server);

const user = 'test';
const pass = 'pass';
export const basic = Buffer.from(`${user}:${pass}`).toString('base64');

export const token = '';

export const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function assertError(done: () => any, status: number, message?: string) {
  return (res: ChaiHttp.Response) => {
    res.status.should.equal(status);
    res.body.should.have.property('status').that.equal(status);
    const messageTest = res.body.should.have.property('message');
    if (message) {
      messageTest.that.equal(message);
    }
    done();
  };
}

export function exclisiveInclude(input: Object, expectedKeys: string[]) {
  for (const key of Object.keys(input)) {
    expect(expectedKeys, `Unepected property "${key}"`).to.include(key);
  }
}
