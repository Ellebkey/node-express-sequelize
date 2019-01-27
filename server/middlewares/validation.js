const Joi = require('joi');
const _ = require('lodash');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

/** Validation function */
module.exports = joiObject => (req, res, next) => {
  const apiError = new APIError({
    message: 'Validation Error',
    status: httpStatus.UNPROCESSABLE_ENTITY,
    stack: undefined,
  });

  const data = { body: req.body, query: req.query, params: req.params };

  const validate = Joi.validate(data, joiObject, { abortEarly: false, allowUnknown: true });

  if (validate.error) {
    const errorMessage = _
      .chain(validate.error.details)
      .map((o, idx) => `${idx + 1}. ${o.message}`)
      .value();

    const message = _.join(errorMessage, ', ').replace(/['"]+/g, '');

    apiError.error = validate.error;
    apiError.message = message;
    return next(apiError);
  }
  return next();
};
