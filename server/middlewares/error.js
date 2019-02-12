const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const config = require('../../config/config');

const handler = (err, req, res, next) => { // eslint-disable-line
  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    tag: err.tag,
    errors: err.errors,
    stack: err.stack,
  };
  if (config.env !== 'development') {
    delete response.stack;
  }
  res.status(err.status);
  res.json({ error: response });
  res.end();
};
exports.handler = handler;

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = (err, req, res, next) => { // eslint-disable-line
  let convertedError = err;

  if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      tag: err.tag,
      status: err.status,
      stack: err.stack,
    });
  }
  return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => { // eslint-disable-line
  const err = new APIError({
    message: 'API Not found',
    tag: 'not-found',
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};

/**
 * Catch 429 ratelimit exceeded
 * @public
 */
exports.rateLimitHandler = (req, res, next) => { // eslint-disable-line
  const err = new APIError({
    message: 'Rate limt exceeded, please try again later some time.',
    tag: 'limit-exceed',
    status: httpStatus.TOO_MANY_REQUESTS,
  });
  return handler(err, req, res);
};
