const expect = require('chai').expect;
const assert = require('chai').assert;
const request = require('supertest');

const {server} = require('../server-setup');

const userCredentials = {
  username: 'enriqueyt',
  password: 'password1'
};

const authenticatedUser = request.agent(server);

describe('/oauth', () => {
  it.skip('should login new user to the add', () => {
    authenticatedUser
      .get('/api/auth')
      .send(userCredentials)
      .set({
        Authorization: 'Bearer xf8rvp57YnAwr7LHE1lI6eB9845M2yuvaGVby2AyXkYcaAB4pHawHVD8mx7HlgTT9AVQoSUTasxfq0' +
          'M8pkGsfBo97pvBmWG6EqPieVkQhCRnr3ih50CZLI1PxV1jHo3nrRI1SYc4bd4kodxYx4HwVbMwAS6cluyvn1Zc1LUceW8E9lnfE7GFV' +
          'jzvP14a7jqcojBDET8NvAWpGAy9x2uYO51GHcnLSwEUUP2OGuun5ae34qWoEtvQrpxAkY2VnPQB'
      })
      .end((err, response) => {
        if (err) {
          assert.fail(err);
        }
        expect(response.statusCode).to.equal(200);
      });
  });
});
