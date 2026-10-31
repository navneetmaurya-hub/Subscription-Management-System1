const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    rate: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tax', taxSchema);
