// > 8 chars, 1 uppercase, 1 lowercase, 1 special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{9,}$/;
exports.PASSWORD_REGEX = PASSWORD_REGEX;
exports.PASSWORD_MESSAGE =
  'Password must be more than 8 characters with an uppercase letter, a lowercase letter and a special character';
