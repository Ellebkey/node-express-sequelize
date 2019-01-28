const request = require('supertest-as-promised');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const { expect } = chai;
const db = require('../config/sequelize');
const app = require('../index.js');
const config = require('../config/config');

chai.config.includeStack = true;

/**
 * root level hooks
 */
let jwtToken;

let user = {
  username: 'newUser',
  mobileNumber: '1234567890',
  email: 'user@domain.com',
  password: 'mypassword'
};

before((done) => {
  const validUserCredentials = { // needs to be on db
    username: 'user',
    password: 'express'
  };

  db.sequelize.sync();

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

after(() => {
  db.User.destroy({ where: { username: user.username } });
});

describe('## User APIs', () => {
  describe('# POST /api/users', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/api/users')
        .set('authorization', jwtToken)
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(user.username);
          expect(res.body.mobileNumber).to.equal(user.mobileNumber);
          user = res.body;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/:userId', () => {
    it('should get user details', (done) => {
      request(app)
        .get(`/api/users/${user.id}`)
        .set('authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(user.username);
          expect(res.body.mobileNumber).to.equal(user.mobileNumber);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/api/users/1111111111')
        .set('authorization', jwtToken)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.error.message).to.equal('User with id: 1111111111, was not found');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/users/:userId', () => {
    it('should update user details', (done) => {
      user.username = 'KK';
      request(app)
        .put(`/api/users/${user.id}`)
        .set('authorization', jwtToken)
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal('KK');
          expect(res.body.mobileNumber).to.equal(user.mobileNumber);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/', () => {
    it('should get all users', (done) => {
      request(app)
        .get('/api/users')
        .set('authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });

    it('should get all users (with limit and skip)', (done) => {
      request(app)
        .get('/api/users')
        .set('authorization', jwtToken)
        .query({ limit: 10, skip: 1 })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/users/', () => {
    it('should delete user', (done) => {
      request(app)
        .delete(`/api/users/${user.id}`)
        .set('authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.username).to.equal(user.username);
          done();
        })
        .catch(done);
    });
  });
});
