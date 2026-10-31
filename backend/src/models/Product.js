const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  attribute: { type: String, required: true }, // e.g. "Brand"
  value: { type: String, required: true },     // e.g. "Odoo"
  extraPrice: { type: Number, default: 0 },    // e.g. 560
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['service', 'software', 'goods', 'addon'], default: 'software' },
    salesPrice: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, default: 0, min: 0 },
    notes: String,
    variants: [variantSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);
