const bcrypt = require('bcrypt');
const db = require('../../config/sequelize');
const logger = require('../../config/winston');

const controller = {};

/**
 * Load user and append to req.
 */
controller.getById = async (req, res, next, id) => {
  try {
    const user = await db.User.findById(id);
    logger.info(`getting user  ${id}`);

    if (!user) {
      return res.status(400)
        .send({
          message: `User with id: ${id}, was not found`,
          error: user
        });
    }
    req.user = user;
    return next();
  } catch (err) {
    logger.error(err);
    return res.status(500)
      .send({
        message: 'An unexpected error occurred',
        error: err
      });
  }
};

/**
 * Get user
 * @returns {User}
 */
controller.read = (req, res) => res.json(req.user);

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
controller.create = async (req, res) => {
  if (!req.body.password) {
    return res.status(500)
      .send({
        message: 'An unexpected error occurred',
        error: 'Not password',
        code: 500
      });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  logger.info(hashedPassword);
  const user = req.body;
  user.hashedPassword = hashedPassword;

  try {
    const savedUser = await db.User.create(user);
    return res.json(savedUser);
  } catch (err) {
    logger.error(`Error in getting user ${err}`);
    return res.status(500)
      .send({
        message: `An unexpected error occurred: ${err}`,
        error: err,
        code: 500
      });
  }
};

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
controller.update = async (req, res) => {
  const { user } = req;

  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;

  try {
    const savedUser = await user.save();
    return res.json(savedUser);
  } catch (err) {
    logger.error(`Error updating user ${err}`);
    return res.status(500)
      .send({
        message: `An unexpected error occurred: ${err}`
      });
  }
};

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
controller.list = async (req, res, next) => {
  const { limit = 50, skip = 0 } = req.query;

  try {
    const users = await db.User.findAll({
      limit,
      skip
    });
    logger.info('getting users list');
    return res.json(users);
  } catch (err) {
    logger.error(`Error in getting users ${err}`);
    return next(err);
  }
};

/**
 * Delete user.
 * @returns {User}
 */
controller.remove = (req, res, next) => {
  const { user } = req;
  user.destroy()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
};

module.exports = controller;