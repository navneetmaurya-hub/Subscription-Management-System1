const router = require('express').Router();
const c = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const v = require('../validators/auth.validator');

router.post('/register', validate(v.registerSchema), c.register);
router.post('/login', validate(v.loginSchema), c.login);
router.post('/forgot-password', validate(v.forgotSchema), c.forgotPassword);
router.post('/reset-password/:token', validate(v.resetSchema), c.resetPassword);
router.get('/me', protect, c.me);

module.exports = router;
