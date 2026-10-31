const Subscription = require('../models/Subscription');
const Invoice = require('../models/Invoice');
const Counter = require('../models/Counter');
const { computeTaxes } = require('./pricing.service');
const { applicableDiscounts, markUsed } = require('./discount.service');
const { addPeriod } = require('../utils/dates');

/**
 * Creates ONE draft invoice for the subscription's next billing period.
 * Idempotent: unique index (subscription, periodStart, periodEnd) blocks duplicates.
 */
exports.generateForSubscription = async (subId) => {
  const sub = await Subscription.findById(subId).populate('plan');
  if (!sub || sub.status !== 'active' || sub.paused) return null;

  const periodStart = sub.lastInvoicedUntil || sub.startDate;
  const periodEnd = addPeriod(periodStart, sub.plan.billingPeriod);

  const lines = sub.lines.map((l) => ({
    product: l.product, description: l.description, quantity: l.quantity,
    unitPrice: l.unitPrice, amount: l.amount, taxes: l.taxes,
  }));
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const { lineTaxes, taxes } = await computeTaxes(lines);
  const discounts = await applicableDiscounts(sub, subtotal);

  const taxTotal = lineTaxes.reduce((a, b) => a + b, 0);
  const discountTotal = discounts.reduce((a, d) => a + d.amount, 0);
  const total = +(subtotal + taxTotal - discountTotal).toFixed(2);

  const dueDate = new Date(periodStart);
  dueDate.setDate(dueDate.getDate() + (sub.paymentTermsDays || 0));

  try {
    const invoice = await Invoice.create({
      number: await Counter.nextSeq('INV'),
      subscription: sub._id,
      customer: sub.customer,
      periodStart, periodEnd, dueDate,
      lines: lines.map((l, i) => ({ ...l, taxAmount: lineTaxes[i] })),
      taxes, discounts, subtotal, taxTotal, discountTotal, total,
    });
    await markUsed(discounts.map((d) => d.discount));
    sub.lastInvoicedUntil = periodEnd;
    sub.nextBillingDate = periodEnd;
    await sub.save();
    return invoice;
  } catch (err) {
    if (err.code === 11000) return null; // already billed for this period
    throw err;
  }
};

exports.runBillingCycle = async (now = new Date()) => {
  const due = await Subscription.find({
    status: 'active', paused: false, nextBillingDate: { $lte: now },
  }).select('_id').lean();

  let created = 0;
  for (const { _id } of due) {
    if (await exports.generateForSubscription(_id)) created++;
  }
  return { checked: due.length, created };
};
