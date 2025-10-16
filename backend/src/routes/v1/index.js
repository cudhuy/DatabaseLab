const express = require("express");
const authRoute = require("./auth.route");
const entranceRoute = require("./entranceTicket.route");
const userRoute = require("./user.route");
const eventRoute = require("./event.route");
const constantRoute = require("./constant.route");
const gameRoute = require("./game.route");
const dailyRoute = require("./dailyCustomer.route");
const eventBookingRoute = require("./eventBooking.route");
const maintainRoute = require("./maintain.route");
const payRoute = require("./pay.route");
const vipRoute = require("./vip.route");
const vipVoucherRoute = require("./vipVoucher.route");
const metaDataRoute = require("./metadata.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/entranceticket",
    route: entranceRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/event",
    route: eventRoute,
  },
  {
    path: "/constant",
    route: constantRoute,
  },
  {
    path: "/game",
    route: gameRoute,
  },
  {
    path: "/dailycustomer",
    route: dailyRoute,
  },
  {
    path: "/eventbooking",
    route: eventBookingRoute,
  },
  {
    path: "/maintainance",
    route: maintainRoute,
  },
  {
    path: "/pay",
    route: payRoute,
  },
  {
    path: "/vip",
    route: vipRoute,
  },
  {
    path: "/vipvoucher",
    route: vipVoucherRoute,
  },
  {
    path: "/metadata",
    route: metaDataRoute,
  },
];
defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});
module.exports = router;
