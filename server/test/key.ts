import { request, assertError } from '.'

describe('keys tests', () => {
  const validKey = { "name": "key1" };

  describe('/user/${userId}/key (post)', () => {
    it('should return 400 on invalid uuid', (done) => {
      request()
        .post('/user/test/key')
        .send(validKey)
        .then(assertError(done, 400))
        .catch(done);
    });

    it('should return 400 on valid uuid but unknown user', (done) => {
      request()
        .post('/user/d4075f08-bb76-405c-bf6f-b353df9e0c16/key')
        .send(validKey)
        .then(assertError(done, 400))
        .catch(done);
    });
  });
});
