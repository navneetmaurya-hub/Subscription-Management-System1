const mongoose = require('mongoose');
const { PAYMENT_METHODS } = require('../config/constants');

const paymentSchema = new mongoose.Schema(
  {
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    method: { type: String, enum: PAYMENT_METHODS, required: true },
    amount: { type: Number, required: true, min: 0.01 },
    date: { type: Date, default: Date.now },
    note: String,
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
paymentSchema.index({ invoice: 1 });
paymentSchema.index({ date: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
