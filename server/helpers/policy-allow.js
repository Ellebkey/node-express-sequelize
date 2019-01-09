const Accesslist = require('acl');

// Using the memory backend
const acl = new Accesslist(new Accesslist.memoryBackend()); // eslint-disable-line new-cap
/**
 * Check If Policy Allows
 */
exports.isAllowed = async (req, res, next) => {
  const roles = (req.user) ? req.user.roles : ['guest'];

  try {
    const isAllowed = await acl
      .areAnyRolesAllowed(roles, req.originalUrl, req.method.toLowerCase());
    if (isAllowed) {
      // Access granted! Invoke next middleware
      return next();
    }

    return res.status(403)
      .json({
        error: {
          msg: 'User is not authorized'
        }
      });
  } catch (e) {
    return res.status(500)
      .json({
        error: {
          msg: 'Unexpected authorization error'
        }
      });
  }
};

/** Variable to set all policies */
exports.aclBackend = () => acl;
