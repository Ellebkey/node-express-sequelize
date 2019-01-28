const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const { expect } = chai;
const app = require('../index');
const config = require('../config/config');

chai.config.includeStack = true;

/**
 * root level hooks
 */
let jwtToken;

before((done) => {
  const validUserCredentials = { // needs to be on db
    username: 'user',
    password: 'express'
  };

  request(app)
    .post('/api/auth/login')
    .send(validUserCredentials)
    .expect(httpStatus.OK)
    .then((res) => {
      expect(res.body).to.have.property('token');
      jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
        expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
        expect(decoded.username).to.equal(validUserCredentials.username);
        jwtToken = res.body.token;
        done();
      });
    })
    .catch(done);
});

describe('## Misc', () => {
  describe('# GET /api/health-check', () => {
    it('should return OK', (done) => {
      request(app)
        .get('/api/health-check')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/404', () => {
    it('should return 404 status', (done) => {
      request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.error.message).to.equal('API Not found');
          done();
        })
        .catch(done);
    });
  });

  describe('# Error Handling', () => {
    it('should handle express validation error - username is required', (done) => {
      request(app)
        .post('/api/users')
        .set('authorization', jwtToken)
        .send({
          mobileNumber: '1234567890'
        })
        .expect(httpStatus.UNPROCESSABLE_ENTITY)
        .then(() => {
          done();
        })
        .catch(done);
    });
  });
});
