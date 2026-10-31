const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { ROLES } = require('../config/constants');

// Admin only: add staff
exports.createStaff = asyncHandler(async (req, res) => {
  if (await User.findOne({ email: req.body.email })) throw new AppError('Email already registered', 409);
  const user = await User.create({ ...req.body, role: ROLES.STAFF });
  res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

exports.listUsers = asyncHandler(async (req, res) => {
  const filter = req.query.role ? { role: req.query.role } : {};
  res.json({ success: true, data: await User.find(filter).sort('-createdAt').lean() });
});

exports.setActive = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: !!req.body.isActive }, { new: true });
  if (!user) throw new AppError('Not found', 404);
  res.json({ success: true, data: user });
});
