import { request, uuid, assertError } from './index'

describe('/user', () => {
    describe('/user (get)', () => {
        it('should return 404 on missing uuid', (done) => {
            request()
                .get('/user')
                .then(assertError(done, 404))
                .catch(done);
        });

        it('should return 400 on invalid uuid', (done) => {
            request()
                .get('/user/test')
                .then(assertError(done, 400))
                .catch(done);
        });

        it('should return 404 on valid uuid with no matching user', (done) => {
            request()
                .get('/user/3876dc71-c5bd-45e0-8a05-984c693e8f8c')
                .then(assertError(done, 404))
                .catch(done);
        });
    });

    describe('/user (post)', () => {

        const user = {
            firstName: "tester",
            lastName: "example",
            username: "test",
            password: "pass"
        }

        const email = 'tester@example.com';

        let userId = null;

        it('should create user', (done) => {
            request()
                .post('/user')
                .send(user)
                .then((res) => {
                    const { body, status } = res;
                    status.should.be.equal(200);
                    body.should.have.property('id').to.be.a('string').that.match(uuid);
                    body.should.have.property('type').to.be.a('string').that.equal('user');
                    body.should.have.property('status').to.be.a('string').that.equal('active');
                    body.should.have.property('lastLogin').to.be.a('number').that.equal(0);
                    body.should.have.property('firstName').to.be.a('string').that.equal(user.firstName);
                    body.should.have.property('lastName').to.be.a('string').that.equal(user.lastName);
                    body.should.have.property('username').to.be.a('string').that.equal(user.username);
                    body.should.have.property('email').to.be.equal(null);
                    body.should.have.property('updatedAt').to.be.a('number');
                    body.should.have.property('createdAt').to.be.a('number');
                    body.should.not.have.property('password');
                    body.should.not.have.property('password_hash');
                    body.should.not.have.property('password_salt');
                    body.should.not.have.property('password_itrs');

                    // saving user id for next tests
                    userId = body.id;

                    done();
                })
                .catch(done);
        });

        it('should return conflict if creating a user with same username', (done) => {
            request().post(`/user/`).send(user).then(assertError(done, 409)).catch(done);
        });

        it('should update user', (done) => {
            request()
                .put(`/user/${userId}`)
                .send({ email })
                .then((res) => {
                    const { body, status } = res;
                    status.should.be.equal(200);
                    body.should.have.property('id').to.be.a('string').that.equal(userId);
                    body.should.have.property('email').to.be.a('string').that.equal(email);
                    done();
                }).catch(done);
        });

        it('should return conflict if creating a user with same email', (done) => {
            request()
                .post('/user')
                .send(Object.assign({}, user, { email }))
                .then(assertError(done, 409))
                .catch(done);
        });

    });
});

