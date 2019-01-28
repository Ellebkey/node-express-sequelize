const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const db = require('../../config/sequelize');
const config = require('../../config/config');
const logger = require('../../config/winston');
const APIError = require('../utils/APIError');

const apiError = new APIError({
  message: 'An unexpected error occurred',
  status: httpStatus.INTERNAL_SERVER_ERROR,
  stack: undefined,
});

const controller = {};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
controller.login = async (req, res, next) => {
  try {
    const user = await db.User.findOne({ where: { username: req.body.username } });

    if (!user) {
      apiError.status = httpStatus.NOT_FOUND;
      apiError.message = 'User is not on database';
      return next(apiError);
    }

    const validPassword = await bcrypt.compare(req.body.password, user.hashedPassword);

    if (!validPassword) {
      apiError.status = httpStatus.UNAUTHORIZED;
      apiError.message = 'Invalid password';
      return next(apiError);
    }
    const token = jwt.sign({
      username: user.username,
      roles: user.roles,
    }, config.jwtSecret);

    return res.json({
      token,
      roles: user.roles,
      username: user.username
    });
  } catch (err) {
    logger.error(`Error on login ${err}`);
    apiError.error = err;
    return next(apiError);
  }
};

//  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
//  return next(err);

controller.signup = async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = req.body;
  user.hashedPassword = hashedPassword;

  try {
    await db.User.save(user);

    const token = jwt.sign({
      username: user.username
    }, config.jwtSecret);

    return res.json({
      token,
      roles: user.roles,
      username: user.username
    });
  } catch (err) {
    logger.error(`Error on singup ${err}`);
    apiError.error = err;
    return next(apiError);
  }
};

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
controller.getRandomNumber = (req, res) => {
  // req.user is assigned by jwt middleware if valid token is provided
  logger.info('getting ramdom number');
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
};

module.exports = controller;
