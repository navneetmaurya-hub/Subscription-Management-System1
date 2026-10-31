const router = require('express').Router();
const c = require('../controllers/subscription.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);
router.use((req, res, next) => {
  if (req.user.role === 'customer') req.baseFilter = { customer: req.user._id }; // portal: own data only
  next();
});

router.get('/', c.list);
router.get('/:id', c.get);

router.use(restrictTo('admin', 'staff'));
router.post('/', c.create);
router.post('/from-template/:templateId', c.createFromTemplate);
router.put('/:id', c.update);
router.patch('/:id/status', c.changeStatus);

module.exports = router;
