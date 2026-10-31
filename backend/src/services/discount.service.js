const Discount = require('../models/Discount');

// Active, unexpired, not-exhausted discounts for a subscription, with computed amounts
exports.applicableDiscounts = async (subscription, subtotal) => {
  const now = new Date();
  const candidates = await Discount.find({
    isActive: true,
    startDate: { $lte: now },
    $and: [
      { $or: [{ endDate: null }, { endDate: { $exists: false } }, { endDate: { $gte: now } }] },
      { $or: [{ usageLimit: null }, { usageLimit: { $exists: false } }, { $expr: { $lt: ['$usedCount', '$usageLimit'] } }] },
    ],
  });

  const totalQty = subscription.lines.reduce((s, l) => s + l.quantity, 0);
  const result = [];

  for (const d of candidates) {
    if (subtotal < d.minPurchase || totalQty < d.minQuantity) continue;
    let base = 0;
    if (d.appliesTo === 'subscription') {
      if (!d.subscriptions.some((s) => String(s) === String(subscription._id))) continue;
      base = subtotal;
    } else {
      const matched = subscription.lines.filter((l) => d.products.some((p) => String(p) === String(l.product)));
      if (!matched.length) continue;
      base = matched.reduce((s, l) => s + l.amount, 0);
    }
    const amount = d.type === 'percentage' ? (base * d.value) / 100 : Math.min(d.value, base);
    result.push({ discount: d._id, name: d.name, amount: +amount.toFixed(2) });
  }
  return result;
};

exports.markUsed = (ids) => Discount.updateMany({ _id: { $in: ids } }, { $inc: { usedCount: 1 } });
