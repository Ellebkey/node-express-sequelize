const express = require('express');
const path = require('path');
const glob = require('glob');
const _ = require('lodash');
const logger = require('./config/winston');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
  res.send('OK');
});

/** Configure the modules ACL policies */
logger.info('Initializing Modules Server Policies...');
_.forEach(glob.sync('./server/policies/*.js'), (file) => {
  require(path.resolve(file)).invokeRolesPolicies(); // eslint-disable-line
});

/** Configure the modules server routes */
logger.info('Initializing Modules Server Routes...');
_.forEach(glob.sync('./server/routes/*.js'), (file) => {
  const name = path.basename(file, '.route.js');
  router.use(`/${name}`, require(path.resolve(file))); // eslint-disable-line
});

module.exports = router;
