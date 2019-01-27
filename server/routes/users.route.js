const express = require('express');
const paramValidation = require('../validations/user.validation');
const users = require('../controllers/user.controller');
const canAccess = require('../middlewares/auth');
const { isAllowed } = require('../middlewares/policy-allow');
const validate = require('../middlewares/validation');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .all(canAccess, isAllowed)
  .get(users.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), users.create);

router.route('/:userId')
  .all(canAccess, isAllowed)
  /** GET /api/users/:userId - Get user */
  .get(users.read)

  /** PUT /api/users/:userId - Update user */
  .put(users.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(users.remove);

router.param('userId', users.getById);

module.exports = router;
