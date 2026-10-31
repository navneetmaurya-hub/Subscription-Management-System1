const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new AppError('Not authenticated', 401);
  const decoded = jwt.verify(header.split(' ')[1], jwtSecret);
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw new AppError('User no longer exists or is disabled', 401);
  req.user = user;
  next();
});

// usage: restrictTo('admin', 'staff')
exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return next(new AppError('Forbidden', 403));
  next();
};
