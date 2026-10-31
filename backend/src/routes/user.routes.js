const router = require('express').Router();
const c = require('../controllers/user.controller');
const validate = require('../middleware/validate');
const { protect, restrictTo } = require('../middleware/auth');
const { createStaffSchema } = require('../validators/auth.validator');

router.use(protect);
router.post('/staff', restrictTo('admin'), validate(createStaffSchema), c.createStaff);
router.get('/', restrictTo('admin', 'staff'), c.listUsers);
router.patch('/:id/active', restrictTo('admin'), c.setActive);

module.exports = router;
