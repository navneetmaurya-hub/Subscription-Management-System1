const { nodeEnv } = require('../config/env');

exports.notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

exports.errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message;

  if (err.code === 11000) {
    status = 409;
    message = `Duplicate value for: ${Object.keys(err.keyValue).join(', ')}`;
  }
  if (err.name === 'ValidationError') status = 400;
  if (err.name === 'CastError') { status = 400; message = `Invalid ${err.path}`; }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401; message = 'Invalid or expired token';
  }

  res.status(status).json({
    success: false,
    message,
    ...(nodeEnv === 'development' && { stack: err.stack }),
  });
};
