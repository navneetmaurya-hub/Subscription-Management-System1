const mongoose = require('mongoose');
const { INVOICE_STATUS } = require('../config/constants');

const invoiceLine = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  description: String,
  quantity: Number,
  unitPrice: Number,
  taxAmount: { type: Number, default: 0 },
  amount: Number,
});

const invoiceSchema = new mongoose.Schema(
  {
    number: { type: String, unique: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    invoiceDate: { type: Date, default: Date.now },
    dueDate: Date,
    lines: [invoiceLine],
    taxes: [{ tax: { type: mongoose.Schema.Types.ObjectId, ref: 'Tax' }, name: String, amount: Number }],
    discounts: [{ discount: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' }, name: String, amount: Number }],
    subtotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    discountTotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    status: { type: String, enum: INVOICE_STATUS, default: 'draft' },
    sentAt: Date,
  },
  { timestamps: true }
);

// Guarantees nothing is billed twice for the same period
invoiceSchema.index({ subscription: 1, periodStart: 1, periodEnd: 1 }, { unique: true });
invoiceSchema.index({ status: 1, dueDate: 1 });
invoiceSchema.index({ customer: 1, createdAt: -1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
