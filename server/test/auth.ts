import agents from './agents';
import { } from './utils';
import * as assert from 'assert';
import './before';

function servers() {
  return agents.api;
}

describe('/login', () => {

  it('can login with basic on API server', (done) => {
    servers()
      .get('/login')
      .auth('admin', 'pass')
      .then((res) => {
        const { body, status } = res;
        assert.equal(status, 200);

        assert(body.user);
        assert(body.user.username);
        assert.equal(body.user.username, 'admin');
        assert(body.user.role);
        assert.equal(body.user.role, 'admin');
        assert(body.user.identity);

        done();
      })
      .catch(done);
  });

});

