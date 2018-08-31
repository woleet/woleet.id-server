/* tslint-env mocha */
/* tslint prefer-arrow-callback: "off" */
/* tslint import/no-extraneous-dependencies: "off" */

import 'mocha';

import { Response } from 'supertest';
import * as assert from 'assert';

export const basic = (user, pass) => Buffer.from(`${user}:${pass}`).toString('base64');

export const token = '';

export const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function assertError(done: () => any, status: number, message?: string) {
  return (res: Response) => {
    assert(res.body.status, 'Error body should have property "status"');
    assert.equal(res.status, status);
    assert.equal(res.body.status, status);
    assert(res.body.message, 'Error body should have property "message"');
    if (message) {
      assert.equal(res.body.message, message);
    }
    done();
  };
}

export function exclisiveInclude(input: Object, expectedKeys: string[]) {
  for (const key of Object.keys(input)) {
    assert(expectedKeys.includes(key), `Unepected property "${key}"`);
  }
}
