const acl = require('../helpers/policy-allow').aclBackend();

/**
 * Invoke Permissions
 */
exports.invokeRolesPolicies = () => {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/users',
      permissions: '*'
    }, {
      resources: '/api/users/:userId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/users',
      permissions: ['get', 'post']
    }, {
      resources: '/api/users/:userId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/users',
      permissions: ['get']
    }, {
      resources: '/api/users/:userId',
      permissions: ['get']
    }]
  }]);
};
