const R = require('ramda');
const moment = require('moment');
const test = require('tape');

const { isTodayInvoiceable, weekDaysBetween } = require("../schedule");

test('isTodayInvoiceable on invoiceable days', function (t) {
  t.plan(2);

  t.equal(isTodayInvoiceable(moment('2017-01-15')), true);
  t.equal(isTodayInvoiceable(moment('2017-01-31')), true);
});

test('isTodayInvoiceable on non-invoiceable days', function (t) {
  t.plan(2);

  t.equal(isTodayInvoiceable(moment('2017-01-16')), false);
  t.equal(isTodayInvoiceable(moment('2017-01-30')), false);
});

test('weekDaysBetween jan 1st-15th', function (t) {
  t.plan(1);

  const days = R.map(m => m.date(), weekDaysBetween(moment('2017-01-01'), moment('2017-01-15')));
  t.deepEqual(days, [2,3,4,5,6,9,10,11,12,13]);
});

test('weekDaysBetween feb 16th-28th', function (t) {
  t.plan(1);

  const days = R.map(m => m.date(), weekDaysBetween(moment('2017-02-16'), moment('2017-02-28')));
  t.deepEqual(days, [16,17,20,21,22,23,24,27,28]);
});
