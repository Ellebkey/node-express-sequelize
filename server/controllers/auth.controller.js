const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const httpStatus = require('http-status');
const db = require('../../config/sequelize');
const config = require('../../config/config');
const logger = require('../../config/winston');

const controller = {};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
controller.login = async (req, res) => {
  try {
    const user = await db.User.findById(req.body.username);
    const validPassword = await bcrypt.compare(req.body.password, user.hashedPassword);

    if (!validPassword) {
      return res.status(401).send({
        message: 'Contraseña invalida'
      });
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
    logger.error(err);
    return res.status(500).send({
      message: 'An unexpected error occurred'
    });
  }
};

//  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
//  return next(err);

controller.signup = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  logger.info(hashedPassword);
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
    logger.error(`Error in getting user ${err}`);
    return res.status(500).send({
      message: `An unexpected error occurred: ${err}`
    });
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
