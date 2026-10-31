const Tax = require('../models/Tax');

exports.computeLineAmount = (unitPrice, quantity) => +(unitPrice * quantity).toFixed(2);

// Taxes are calculated from admin-defined rules attached to each line
exports.computeTaxes = async (lines) => {
  const taxIds = [...new Set(lines.flatMap((l) => (l.taxes || []).map(String)))];
  const taxes = await Tax.find({ _id: { $in: taxIds }, isActive: true }).lean();
  const byId = Object.fromEntries(taxes.map((t) => [String(t._id), t]));

  const summary = {};
  const lineTaxes = lines.map((l) => {
    let lineTax = 0;
    (l.taxes || []).forEach((id) => {
      const t = byId[String(id)];
      if (!t) return;
      const amt = t.type === 'percentage' ? (l.amount * t.rate) / 100 : t.rate * l.quantity;
      lineTax += amt;
      summary[t._id] = summary[t._id] || { tax: t._id, name: t.name, amount: 0 };
      summary[t._id].amount += amt;
    });
    return +lineTax.toFixed(2);
  });
  return { lineTaxes, taxes: Object.values(summary).map((t) => ({ ...t, amount: +t.amount.toFixed(2) })) };
};
