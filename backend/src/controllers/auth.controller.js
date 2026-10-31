const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { signToken, createResetToken, hashToken } = require('../utils/token');
const { sendMail } = require('../utils/mailer');
const { clientUrl } = require('../config/env');
const { ROLES } = require('../config/constants');

const send = (res, user, status = 200) => {
  const obj = user.toObject();
  delete obj.password;
  res.status(status).json({ success: true, token: signToken(user), user: obj });
};

// Public signup -> always a customer
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, company, phone } = req.body;
  if (await User.findOne({ email })) throw new AppError('Email already registered', 409);
  const user = await User.create({ name, email, password, company, phone, role: ROLES.CUSTOMER });
  send(res, user, 201);
});

exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password)))
    throw new AppError('Invalid email or password', 401);
  if (!user.isActive) throw new AppError('Account disabled', 403);
  send(res, user);
});

exports.me = asyncHandler(async (req, res) => res.json({ success: true, user: req.user }));

exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const { raw, hashed } = createResetToken();
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    await user.save({ validateBeforeSave: false });
    const link = `${clientUrl}/reset-password/${raw}`;
    await sendMail({
      to: user.email,
      subject: 'Reset your Subscription Management System password',
      html: `<p>Click to reset your password (valid 30 min):</p><a href="${link}">${link}</a>`,
    });
  }
  res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: hashToken(req.params.token),
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpires');
  if (!user) throw new AppError('Reset link is invalid or has expired', 400);
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  send(res, user);
});
