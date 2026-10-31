require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Tax = require('../src/models/Tax');
const Product = require('../src/models/Product');
const Plan = require('../src/models/Plan');
const Subscription = require('../src/models/Subscription');
const Invoice = require('../src/models/Invoice');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.init(), Subscription.init(), Invoice.init(), Product.init(), Plan.init()]); // build indexes

  if (!(await User.findOne({ role: 'admin' }))) {
    await User.create({ name: 'Admin', email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, role: 'admin' });
    console.log('Admin created:', process.env.ADMIN_EMAIL);
  }
  if (!(await Tax.countDocuments())) await Tax.create({ name: 'GST 18%', type: 'percentage', rate: 18 });
  if (!(await Product.countDocuments()))
    await Product.create({
      name: 'Sample ERP Software', type: 'software', salesPrice: 1000, costPrice: 400,
      variants: [{ attribute: 'Brand', value: 'Odoo', extraPrice: 560 }],
    });
  if (!(await Plan.countDocuments()))
    await Plan.create({ name: 'Monthly Standard', price: 1000, billingPeriod: 'monthly', startDate: new Date(), allowPause: true });

  console.log('Seed complete');
  process.exit(0);
})();
