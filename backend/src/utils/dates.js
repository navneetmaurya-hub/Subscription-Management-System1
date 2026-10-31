exports.addPeriod = (date, period, n = 1) => {
  const d = new Date(date);
  if (period === 'daily') d.setDate(d.getDate() + n);
  else if (period === 'weekly') d.setDate(d.getDate() + 7 * n);
  else if (period === 'monthly') d.setMonth(d.getMonth() + n);
  else if (period === 'yearly') d.setFullYear(d.getFullYear() + n);
  return d;
};
