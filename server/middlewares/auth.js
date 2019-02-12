const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../../config/config');
const APIError = require('../utils/APIError');
/**
 * Middleware to validate user token
 */
module.exports = (req, res, next) => {
  const apiError = new APIError({
    message: 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: undefined,
  });

  if (typeof req.headers.authorization !== 'undefined') {
    try {
      req.user = jwt.verify(req.headers.authorization, config.jwtSecret);
      return next();
    } catch (err) {
      apiError.message = 'Failed to authenticate token!';
      apiError.stack = err.stack;
      apiError.tag = 'failed-token';

      if (err.name === 'TokenExpiredError') {
        apiError.message = 'Need to login again!';
        apiError.tag = 'expired-token';
      }

      return next(apiError);
    }
  } else {
    apiError.message = 'User is not logged, you need a token!';
    return next(apiError);
  }
};
