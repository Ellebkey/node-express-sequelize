const Joi = require('joi');
const _ = require('lodash');

/** Validation function */
module.exports = joiObject => (req, res, next) => {
  const data = { body: req.body, query: req.query, params: req.params };

  const validate = Joi.validate(data, joiObject, { abortEarly: false, allowUnknown: true });

  if (validate.error) {
    const errorMessage = _
      .chain(validate.error.details)
      .map((o, idx) => `${idx + 1}. ${o.message}`)
      .value();

    const message = _.join(errorMessage, ', ').replace(/['"]+/g, '');

    return res.status(422)
      .json({
        message,
        code: 422,
        error: validate.error
      });
  }
  return next();
};
