const jwt = require('jsonwebtoken');

// Middleware to authenticate user tokens
module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user ID from payload to request object
    req.user = decoded.userId;
    
    // Move to the next middleware
    next();
  } catch (err) {
    // If token is invalid, return error
    res.status(401).json({ message: 'Token is not valid' });
  }
};