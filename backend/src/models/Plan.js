const mongoose = require('mongoose');
const { BILLING_PERIODS } = require('../config/constants');

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    billingPeriod: { type: String, enum: BILLING_PERIODS, required: true },
    minQuantity: { type: Number, default: 1, min: 1 },
    startDate: { type: Date, required: true },
    endDate: Date,
    autoClose: { type: Boolean, default: false },
    allowEarlyClose: { type: Boolean, default: false },
    allowPause: { type: Boolean, default: false },
    allowRenew: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
planSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Plan', planSchema);
