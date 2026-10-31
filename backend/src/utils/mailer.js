const nodemailer = require('nodemailer');
const { smtp } = require('../config/env');

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
});

exports.sendMail = async ({ to, subject, html }) => {
  if (!smtp.host) return console.log(`[mail skipped] ${to}: ${subject}`);
  return transporter.sendMail({ from: smtp.from, to, subject, html });
};
