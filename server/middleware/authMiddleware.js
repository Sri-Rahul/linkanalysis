const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

/**
 * Middleware to protect routes that require authentication
 * Verifies the JWT token from the Authorization header
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (remove 'Bearer' prefix)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.log(`User not found for id: ${decoded.id}`);
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error('Auth error details:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

/**
 * Middleware to make protected routes optional
 * If a token is provided, it attaches the user to the request
 * If no token is provided or token is invalid, it continues without a user
 */
const optionalProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Silently fail - this is an optional protection
      console.log('Optional auth failed, continuing as guest');
    }
  }
  
  next();
});

module.exports = { protect, optionalProtect };