// Products, Plans, Taxes, Discounts, Quotation Templates
// Write: admin only. Read: admin + staff (+ customer for products/plans). Discounts: admin only.
const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const crud = require('../controllers/crud.factory');
const Product = require('../models/Product');
const Plan = require('../models/Plan');
const Tax = require('../models/Tax');
const Discount = require('../models/Discount');
const QuotationTemplate = require('../models/QuotationTemplate');

const build = (Model, opts, { readRoles = ['admin', 'staff'] } = {}) => {
  const r = express.Router();
  const c = crud(Model, opts);
  r.use(protect);
  r.get('/', restrictTo(...readRoles), c.list);
  r.get('/:id', restrictTo(...readRoles), c.get);
  r.post('/', restrictTo('admin'), c.create);
  r.put('/:id', restrictTo('admin'), c.update);
  r.delete('/:id', restrictTo('admin'), c.remove);
  return r;
};

exports.products = build(Product, { searchFields: ['name'] }, { readRoles: ['admin', 'staff', 'customer'] });
exports.plans = build(Plan, { searchFields: ['name'] }, { readRoles: ['admin', 'staff', 'customer'] });
exports.taxes = build(Tax, { searchFields: ['name'] });
exports.discounts = build(Discount, { searchFields: ['name'], populate: 'products' }, { readRoles: ['admin'] });
exports.templates = build(QuotationTemplate, { searchFields: ['name'], populate: 'plan lines.product' });
