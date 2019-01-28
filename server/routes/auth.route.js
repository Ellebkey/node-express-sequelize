const express = require('express');
const authCtrl = require('../controllers/auth.controller');
const canAccess = require('../middlewares/auth');
const policies = require('../middlewares/policy-allow');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(authCtrl.login);

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number')
  .get(canAccess, policies.isAllowed, authCtrl.getRandomNumber);

module.exports = router;
