const Invoice = require('../models/Invoice');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { INVOICE_FLOW } = require('../config/constants');
const { generateForSubscription, runBillingCycle } = require('../services/invoice.service');
const factory = require('./crud.factory')(Invoice, { searchFields: ['number'], populate: 'customer subscription' });

exports.list = factory.list;
exports.get = factory.get;

exports.generate = asyncHandler(async (req, res) => {
  const inv = await generateForSubscription(req.params.subscriptionId);
  if (!inv) throw new AppError('Nothing to bill (already billed, paused or inactive)', 409);
  res.status(201).json({ success: true, data: inv });
});

exports.runBilling = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await runBillingCycle() });
});

exports.changeStatus = asyncHandler(async (req, res) => {
  const inv = await Invoice.findById(req.params.id);
  if (!inv) throw new AppError('Not found', 404);
  if (!INVOICE_FLOW[inv.status].includes(req.body.status))
    throw new AppError(`Cannot move invoice from ${inv.status} to ${req.body.status}`, 400);
  inv.status = req.body.status;
  await inv.save();
  res.json({ success: true, data: inv });
});

// TODO: actually email the invoice / render PDF for print
exports.send = asyncHandler(async (req, res) => {
  const inv = await Invoice.findByIdAndUpdate(req.params.id, { sentAt: new Date() }, { new: true });
  res.json({ success: true, data: inv });
});
