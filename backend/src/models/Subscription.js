const mongoose = require('mongoose');
const { SUBSCRIPTION_STATUS } = require('../config/constants');

const lineSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant: { attribute: String, value: String },
  description: String,
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  taxes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tax' }],
  amount: { type: Number, required: true },
});

const subscriptionSchema = new mongoose.Schema(
  {
    number: { type: String, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'QuotationTemplate' },
    startDate: { type: Date, required: true },
    expiryDate: Date,
    paymentTerms: { type: String, default: 'Immediate' },
    paymentTermsDays: { type: Number, default: 0 },
    lines: [lineSchema],
    discounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discount' }],
    status: { type: String, enum: SUBSCRIPTION_STATUS, default: 'draft' },
    paused: { type: Boolean, default: false },
    nextBillingDate: Date,
    lastInvoicedUntil: Date,
    subtotal: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

subscriptionSchema.index({ status: 1, paused: 1, nextBillingDate: 1 });
subscriptionSchema.index({ customer: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
