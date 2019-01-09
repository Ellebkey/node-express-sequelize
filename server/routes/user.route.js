const express = require('express');
const paramValidation = require('../validations/user.validation');
const users = require('../controllers/user.controller');
const canAccess = require('../helpers/auth');
const policies = require('../helpers/policy-allow');
const validate = require('../helpers/validation');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/users')
  /** GET /api/users - Get list of users */
  .all(canAccess, policies.isAllowed)
  .get(users.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), users.create);

router.route('users/:userId')
  /** GET /api/users/:userId - Get user */
  .get(users.read)

  /** PUT /api/users/:userId - Update user */
  .put(users.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(users.remove);

router.param('userId', users.getById);

module.exports = router;
