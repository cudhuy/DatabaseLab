const express = require("express");

const defaultRoutes = [
  ["auth", require("./auth.route")],
  ["entranceticket", require("./entranceTicket.route")],
  ["users", require("./user.route")],
  ["event", require("./event.route")],
  ["constant", require("./constant.route")],
  ["game", require("./game.route")],
  ["dailycustomer", require("./dailyCustomer.route")],
  ["eventbooking", require("./eventBooking.route")],
  ["maintainance", require("./maintain.route")],
  ["pay", require("./pay.route")],
  ["vip", require("./vip.route")],
  ["vipvoucher", require("./vipVoucher.route")],
  ["metadata", require("./metadata.route")],
];

const router = express.Router();

for (const [path, route] of defaultRoutes) {
  router.use(`/${path}`, route);
}

module.exports = router;
