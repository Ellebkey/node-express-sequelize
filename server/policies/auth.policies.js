const acl = require('../helpers/policy-allow').aclBackend();

/**
 * Invoke Permissions
 */
exports.invokeRolesPolicies = () => {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/auth/random-number',
      permissions: ['get']
    }]
  }]);
};
