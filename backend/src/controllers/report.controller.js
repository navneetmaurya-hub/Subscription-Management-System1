const asyncHandler = require('../utils/asyncHandler');
const { summary } = require('../services/report.service');

exports.summary = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await summary(req.query) });
});
