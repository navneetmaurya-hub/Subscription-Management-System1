const { SUBSCRIPTION_FLOW } = require('../config/constants');
const AppError = require('../utils/AppError');

exports.transition = async (sub, nextStatus) => {
  if (!SUBSCRIPTION_FLOW[sub.status].includes(nextStatus))
    throw new AppError(`Cannot move subscription from ${sub.status} to ${nextStatus}`, 400);
  sub.status = nextStatus;
  if (nextStatus === 'active' && !sub.nextBillingDate) sub.nextBillingDate = sub.startDate;
  return sub.save();
};
