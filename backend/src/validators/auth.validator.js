const { z } = require('zod');
const { PASSWORD_REGEX, PASSWORD_MESSAGE } = require('../utils/password');

const password = z.string().regex(PASSWORD_REGEX, PASSWORD_MESSAGE);

exports.registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password,
  company: z.string().optional(),
  phone: z.string().optional(),
});
exports.loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
exports.forgotSchema = z.object({ email: z.string().email() });
exports.resetSchema = z.object({ password });
exports.createStaffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password,
});
