const Subscription = require('../models/Subscription');
const QuotationTemplate = require('../models/QuotationTemplate');
const Product = require('../models/Product');
const Counter = require('../models/Counter');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const factory = require('./crud.factory')(Subscription, { searchFields: ['number'], populate: 'customer plan' });
const { transition } = require('../services/subscription.service');
const { addPeriod } = require('../utils/dates');

exports.list = factory.list;
exports.get = factory.get;
exports.update = factory.update;

exports.create = asyncHandler(async (req, res) => {
  const sub = await Subscription.create({
    ...req.body,
    number: await Counter.nextSeq('SUB'),
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, data: sub });
});

// Start from a quotation template (copies plan + lines)
exports.createFromTemplate = asyncHandler(async (req, res) => {
  const tpl = await QuotationTemplate.findById(req.params.templateId);
  if (!tpl) throw new AppError('Template not found', 404);
  const startDate = req.body.startDate ? new Date(req.body.startDate) : new Date();

  const lines = [];
  for (const l of tpl.lines) {
    const p = await Product.findById(l.product);
    const extra = p.variants.find((v) => v.attribute === l.variant?.attribute && v.value === l.variant?.value)?.extraPrice || 0;
    const unitPrice = p.salesPrice + extra;
    lines.push({ product: p._id, variant: l.variant, quantity: l.quantity, unitPrice, amount: unitPrice * l.quantity });
  }
  const sub = await Subscription.create({
    number: await Counter.nextSeq('SUB'),
    customer: req.body.customer,
    plan: tpl.plan,
    template: tpl._id,
    startDate,
    expiryDate: addPeriod(startDate, 'daily', tpl.validityDays),
    paymentTerms: req.body.paymentTerms,
    lines,
    subtotal: lines.reduce((s, l) => s + l.amount, 0),
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, data: sub });
});

exports.changeStatus = asyncHandler(async (req, res) => {
  const sub = await Subscription.findById(req.params.id);
  if (!sub) throw new AppError('Not found', 404);
  await transition(sub, req.body.status);
  res.json({ success: true, data: sub });
});
