const paypal = require("paypal-rest-sdk");
const config = require("../config/config");

paypal.configure({
  mode: "sandbox",
  client_id: config.paypal.client_id,
  client_secret: config.paypal.client_secret,
});

module.exports = paypal;
