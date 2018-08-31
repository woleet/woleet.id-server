import * as request from 'supertest';
import agents from './agents';
import * as assert from 'assert';

import { uuid, assertError, exclisiveInclude } from './utils';

function servers() {
  return agents.api;
}

describe('/user', () => {
  describe('/user (get)', () => {
    it('should return 404 on missing uuid', (done) => {
      servers()
        .get('/user')
        .then(assertError(done, 404))
        .catch(done);
    });

    it('should return 400 on invalid uuid', (done) => {
      servers()
        .get('/user/test')
        .then(assertError(done, 400))
        .catch(done);
    });

    it('should return 404 on valid uuid with no matching user', (done) => {
      servers()
        .get('/user/3876dc71-c5bd-45e0-8a05-984c693e8f8c')
        .then(assertError(done, 404))
        .catch(done);
    });
  });

  describe('/user (post)', () => {

    const userProperties = [
      'id', 'role', 'defaultKeyId', 'identity',
      'status', 'lastLogin', 'username', 'email',
      'deletedAt', 'updatedAt', 'createdAt'
    ];

    const user = {
      username: 'test' + (+new Date),
      password: 'pass',
      identity: {
        commonName: 'Tester'
      }
    };

    const email = `${user.username}@example.com`;

    let userId = null;

    it('should create user', (done) => {
      servers()
        .post('/user')
        .send(user)
        .then((res) => {
          const { body, status } = res;
          assert.equal(status, 200);
          // status.should.be.equal(200);

          exclisiveInclude(body, userProperties);

          // body.should.have.property('id').to.be.a('string').that.match(uuid);
          // body.should.have.property('type').to.be.a('string').that.equal('user');
          // body.should.have.property('status').to.be.a('string').that.equal('active');
          // body.should.have.property('lastLogin').to.be.a('number').that.equal(0);
          // body.should.have.property('firstName').to.be.a('string').that.equal(user.firstName);
          // body.should.have.property('lastName').to.be.a('string').that.equal(user.lastName);
          // body.should.have.property('username').to.be.a('string').that.equal(user.username);
          // body.should.have.property('email').to.be.equal(null);
          // body.should.have.property('updatedAt').to.be.a('number');
          // body.should.have.property('createdAt').to.be.a('number');

          userId = body.id;

          done();
        })
        .catch(done);
    });

    it('should return conflict if creating a user with same username', (done) => {
      servers().post(`/user/`).send(user).then(assertError(done, 409)).catch(done);
    });

    it('should update user', (done) => {
      servers()
        .put(`/user/${userId}`)
        .send({ email })
        .then((res) => {
          const { body, status } = res;
          assert.equal(status, 200);
          // body.should.have.property('id').to.be.a('string').that.equal(userId);
          // body.should.have.property('email').to.be.a('string').that.equal(email);
          done();
        }).catch(done);
    });

    it('should return conflict if creating a user with same email', (done) => {
      servers()
        .post('/user')
        .send(Object.assign({}, user, { email }))
        .then(assertError(done, 409))
        .catch(done);
    });

  });
});

