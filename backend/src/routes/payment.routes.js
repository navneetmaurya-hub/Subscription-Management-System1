const router = require('express').Router();
const c = require('../controllers/payment.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use((req, res, next) => {
  if (req.user.role === 'customer') req.baseFilter = { customer: req.user._id };
  next();
});
router.get('/', c.list);
router.post('/', restrictTo('admin', 'staff'), c.record);

module.exports = router;
