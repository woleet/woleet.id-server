import { request, token } from '.'

describe('/info', () => {

  it('authenticated user can get information about himself', (done) => {
    request()
      .get('/info')
      .then((res) => {
        const { body, status } = res;
        status.should.equal(200);
        body.should.have.property('email');
        done();
      })
      .catch(done);
  });

});

