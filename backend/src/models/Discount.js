const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['fixed', 'percentage'], required: true },
    value: { type: Number, required: true, min: 0 },
    minPurchase: { type: Number, default: 0 },
    minQuantity: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: Date,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
    appliesTo: { type: String, enum: ['product', 'subscription'], required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
discountSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Discount', discountSchema);
