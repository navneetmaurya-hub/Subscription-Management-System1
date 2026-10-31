const Subscription = require('../models/Subscription');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');

exports.summary = async ({ from, to } = {}) => {
  const dateFilter = {};
  if (from) dateFilter.$gte = new Date(from);
  if (to) dateFilter.$lte = new Date(to);
  const hasDate = Object.keys(dateFilter).length > 0;

  const [activeSubs, revenue, outstanding, overdue] = await Promise.all([
    Subscription.countDocuments({ status: 'active' }),
    Payment.aggregate([
      ...(hasDate ? [{ $match: { date: dateFilter } }] : []),
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    Invoice.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: { $subtract: ['$total', '$amountPaid'] } }, count: { $sum: 1 } } },
    ]),
    Invoice.find({ status: 'confirmed', dueDate: { $lt: new Date() } })
      .populate('customer', 'name email').sort('dueDate').limit(50).lean(),
  ]);

  return {
    activeSubscriptions: activeSubs,
    revenueCollected: revenue[0]?.total || 0,
    paymentsCount: revenue[0]?.count || 0,
    outstandingAmount: outstanding[0]?.total || 0,
    outstandingInvoices: outstanding[0]?.count || 0,
    overdueInvoices: overdue,
  };
};
