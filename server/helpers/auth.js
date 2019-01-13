const jwt = require('jsonwebtoken');
const config = require('../../config/config');

/**
 * Middleware to validate user token
 */
module.exports = (req, res, next) => {
  if (typeof req.headers.authorization !== 'undefined') {
    try {
      req.user = jwt.verify(req.headers.authorization, config.jwtSecret);
      return next();
    } catch (err) {
      return res.status(401).json({
        error: {
          message: 'Failed to authenticate token!',
          error: err,
          code: 401
        }
      });
    }
  } else {
    return res.status(401).json({
      error: {
        message: 'User is not logged, you need a token!',
        code: 401
      }
    });
  }
};
