const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

exports.signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });

exports.createResetToken = () => {
  const raw = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hashed };
};
exports.hashToken = (raw) => crypto.createHash('sha256').update(raw).digest('hex');
