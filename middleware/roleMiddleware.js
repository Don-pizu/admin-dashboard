// middleware/roleMiddleware.js
// Usage: requireRole('admin') or requireRole('admin','manager')

exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) 
      return res.status(401).json({ message: 'User role is not authenticated' });
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role permission' });
    }
    next();
  };
};
