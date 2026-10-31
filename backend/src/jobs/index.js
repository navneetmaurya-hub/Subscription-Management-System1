const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const { runBillingCycle } = require('../services/invoice.service');

module.exports = function startJobs() {
  // Daily 01:00 -> generate invoices for due subscriptions
  cron.schedule('0 1 * * *', async () => {
    console.log('[cron] billing run', await runBillingCycle());
  });

  // Daily 02:00 -> auto-close subscriptions on plans that close themselves at end date
  cron.schedule('0 2 * * *', async () => {
    const plans = await Plan.find({ autoClose: true, endDate: { $lte: new Date() } }).select('_id');
    const res = await Subscription.updateMany(
      { plan: { $in: plans.map((p) => p._id) }, status: 'active' },
      { status: 'closed' }
    );
    console.log('[cron] auto-closed', res.modifiedCount);
  });
};
