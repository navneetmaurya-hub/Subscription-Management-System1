const router = require('express').Router();
const catalog = require('./catalog.routes');

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/products', catalog.products);
router.use('/plans', catalog.plans);
router.use('/taxes', catalog.taxes);
router.use('/discounts', catalog.discounts);
router.use('/quotation-templates', catalog.templates);
router.use('/subscriptions', require('./subscription.routes'));
router.use('/invoices', require('./invoice.routes'));
router.use('/payments', require('./payment.routes'));
router.use('/reports', require('./report.routes'));

module.exports = router;
