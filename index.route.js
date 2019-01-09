const express = require('express');
const path = require('path');
const glob = require('glob');
const logger = require('./config/winston');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
  res.send('OK');
});

/** Configure the modules ACL policies */
logger.info('Initializing Modules Server Policies...');
for (const file of glob.sync( './server/policies/*.js' )) {
  require( path.resolve( file ) ).invokeRolesPolicies();
}

/** Configure the modules server routes */
logger.info('Initializing Modules Server Routes...');
for (const file of glob.sync( './server/routes/*.js' )) {
  router.use('/', require( path.resolve( file ) ));
}



module.exports = router;
