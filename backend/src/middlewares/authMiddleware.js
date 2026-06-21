import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Protect routes for authenticated users
export const protect = async (req, res, next) => {
  let token;

  // Check for the token in the Authorization header (Format: Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token string by splitting off the 'Bearer' prefix
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB using id in payload (exclude password hash from response)
      req.user = await User.findById(decoded.id).select('-password');

      // Move to the next middleware/controller
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Restrict routes to Admin users only
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};