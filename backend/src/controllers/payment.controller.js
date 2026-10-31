const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const factory = require('./crud.factory')(Payment, { populate: 'invoice customer' });

exports.list = factory.list;

exports.record = asyncHandler(async (req, res) => {
  const inv = await Invoice.findById(req.body.invoice);
  if (!inv) throw new AppError('Invoice not found', 404);
  if (inv.status !== 'confirmed') throw new AppError('Only confirmed invoices can receive payments', 400);
  if (req.body.amount > inv.total - inv.amountPaid) throw new AppError('Amount exceeds amount due', 400);

  const payment = await Payment.create({ ...req.body, customer: inv.customer, recordedBy: req.user._id });
  inv.amountPaid = +(inv.amountPaid + payment.amount).toFixed(2);
  if (inv.amountPaid >= inv.total) inv.status = 'paid';
  await inv.save();
  res.status(201).json({ success: true, data: payment, invoice: inv });
});
