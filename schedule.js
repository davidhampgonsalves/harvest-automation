const R = require('ramda');

module.exports.isTodayInvoiceable = function isTodayInvoiceable(now) {
  return R.contains(now.date(), [15, now.clone().endOf('month').date()])
};

module.exports.weekDaysBetween = function workDaysBetween(start, end) {
  const diff = (end.date() + 1) - start.date();
  const momentsBetween = R.addIndex(R.map)((_, offset) => start.clone().date(start.date() + offset), new Array(diff));

  return R.reject(m => R.contains(m.isoWeekday(), [6, 7]), momentsBetween);
}

