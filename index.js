const R = require('ramda');
const Harvest = require('harvest');
const moment = require('moment');
const Mailgun = require('mailgun-js');

const { isTodayInvoiceable, weekDaysBetween } = require('./schedule');
const config = require('./config.json');
const mailgunConfig = require('./mailgun_config.json');

const harvest = new Harvest(config);

const dateArg = process.argv[2];
const now = dateArg ? moment(dateArg) : moment();

if(dateArg) console.log(`Using overriden date: ${now}`);
if(!isTodayInvoiceable(now)) return console.log(`${now} is not an invoice day, doing nothing`);

const start = now.clone().date(now.date() === 15 ? 1 : 16);
const invoiceableMoments = weekDaysBetween(start, now);

// This is the v2 api style
//const lineItems = R.map(m => ({
    //project_id: 9911792,
    //kind: "free-form",
    //quantity: 8,
    //unit_price: 75.00,
  //}), invoiceableMoments);

const csvLineItems = R.pipe(
  R.map(m => `Service,"${m.format('MMMM Do YYYY')}",8,75.00,${8*75.0},false,false,9911792`),
  R.prepend('kind,description,quantity,unit_price,amount,taxed,taxed2,project_id'),
  items => items.join("\n"))(invoiceableMoments);

const invoice = { invoice: {
  client_id: 4180085,
  'csv_line_items': csvLineItems,
  notes: `Total Hours: ${invoiceableMoments.length * 8}`,
}};

harvest.invoices.create(invoice, (error, res, body) => {
  if(error) return console.log("ERROR", error);
  console.log(`Invoice created ${body.id}.`);

  const data = {
    from: `Reminder <postmaster@${mailgunConfig.domain}>`,
    to: mailgunConfig.recipient,
    subject: 'Invoice Reminder',
    text: `Verify and send this: https://davidhampgonsalves.harvestapp.com/invoices/${body.id}`
  };

  Mailgun(mailgunConfig).messages().send(data, function (error, body) {
    console.log(body);
  });
});

