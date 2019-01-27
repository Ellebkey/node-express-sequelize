const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const db = require('../../config/sequelize');
const logger = require('../../config/winston');
const APIError = require('../utils/APIError');

const apiError = new APIError({
  message: 'An unexpected error occurred',
  status: httpStatus.INTERNAL_SERVER_ERROR,
  stack: undefined,
});

const controller = {};

/**
 * Load user and append to req.
 */
controller.getById = async (req, res, next, id) => {
  try {
    const user = await db.User.findByPk(id);
    logger.info(`getting user  ${id}`);

    if (!user) {
      apiError.status = httpStatus.NOT_FOUND;
      apiError.message = `User with id: ${id}, was not found`;
      return next(apiError);
    }

    req.userDB = user;
    return next();
  } catch (err) {
    logger.error(err);
    apiError.error = err;
    return next(apiError);
  }
};

/**
 * Get user
 * @returns {User}
 */
controller.read = (req, res) => res.json(req.userDB);

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
controller.create = async (req, res, next) => {
  if (!req.body.password) {
    apiError.message = 'Not password';
    return next(apiError);
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  logger.info(hashedPassword);
  const user = req.body;
  user.hashedPassword = hashedPassword;

  try {
    const savedUser = await db.User.create(user);
    return res.json(savedUser);
  } catch (err) {
    logger.error(`Error creating user ${err}`);
    apiError.error = err;
    return next(apiError);
  }
};

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
controller.update = async (req, res, next) => {
  const { userDB } = req;

  userDB.username = req.body.username;
  userDB.mobileNumber = req.body.mobileNumber;

  try {
    const savedUser = await userDB.save();
    return res.json(savedUser);
  } catch (err) {
    logger.error(`Error updating user ${err}`);
    apiError.error = err;
    return next(apiError);
  }
};

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
controller.list = async (req, res, next) => {
  const { limit = 50, offset = 0 } = req.query;

  try {
    const users = await db.User.findAll({
      limit: +limit,
      offset: +offset
    });
    logger.info('getting users list');
    return res.json(users);
  } catch (err) {
    logger.error(`Error in getting users ${err}`);
    apiError.error = err;
    return next(apiError);
  }
};

/**
 * Delete user.
 * @returns {User}
 */
controller.remove = async (req, res, next) => {
  const { userDB } = req;

  try {
    const deletedUser = await userDB.destroy();
    return res.json(deletedUser);
  } catch (err) {
    logger.error(`Error trying to deleting user ${err}`);
    apiError.error = err;
    return next(apiError);
  }
};

module.exports = controller;
