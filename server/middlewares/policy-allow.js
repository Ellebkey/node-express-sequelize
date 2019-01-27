const Accesslist = require('acl');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

// Using the memory backend
const acl = new Accesslist(new Accesslist.memoryBackend()); // eslint-disable-line new-cap
/**
 * Check If Policy Allows
 */
exports.isAllowed = async (req, res, next) => {
  const apiError = new APIError({
    message: 'User has not permissions',
    status: httpStatus.FORBIDDEN,
    stack: undefined,
  });

  const roles = (req.user) ? req.user.roles : ['guest'];

  try {
    const isAllowed = await acl
      .areAnyRolesAllowed(roles, req.baseUrl + req.route.path, req.method.toLowerCase());
    if (isAllowed) {
      // Access granted! Invoke next middleware
      return next();
    }
    return next(apiError);
  } catch (e) {
    apiError.error = e;
    apiError.message = 'An unexpected error occurred';
    apiError.staus = httpStatus.INTERNAL_SERVER_ERROR;
    return next(apiError);
  }
};

/** Variable to set all policies */
exports.aclBackend = () => acl;
