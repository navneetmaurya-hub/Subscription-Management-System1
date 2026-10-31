const router = require('express').Router();
const c = require('../controllers/report.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/summary', protect, restrictTo('admin', 'staff'), c.summary);
module.exports = router;
