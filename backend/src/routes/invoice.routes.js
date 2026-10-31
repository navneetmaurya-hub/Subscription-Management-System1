const router = require('express').Router();
const c = require('../controllers/invoice.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use((req, res, next) => {
  if (req.user.role === 'customer') req.baseFilter = { customer: req.user._id, status: { $ne: 'draft' } };
  next();
});

router.get('/', c.list);
router.get('/:id', c.get);

router.use(restrictTo('admin', 'staff'));
router.post('/run-billing', c.runBilling);
router.post('/generate/:subscriptionId', c.generate);
router.patch('/:id/status', c.changeStatus);
router.post('/:id/send', c.send);

module.exports = router;
