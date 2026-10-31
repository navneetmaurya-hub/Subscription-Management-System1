const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    validityDays: { type: Number, required: true, min: 1 },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    lines: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        variant: { attribute: String, value: String },
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuotationTemplate', templateSchema);
