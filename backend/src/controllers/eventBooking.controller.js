const voucherCodes = require("voucher-code-generator");
const mssql = require("mssql");
const { emailService } = require("../services");

/*
const htmlTemplate = (name, code) => `<h1>Thank you</h1>
  <h2>Thank ${name} for booking ticket.Hope you have fun in our event </h2>
  <h4>Your coupon code is <strong>${code}</strong><h4>
  <h4>Please enter the below link to verify your booking</h4>
  <a href="http://localhost:5000/api/v1/eventbooking/verify/${code}">VerifyEmail</a>`;
  */
const getAllBooking = async (req, res, next) => {
  try {
    const request = new mssql.Request();
    const booking = (await request.query(`SELECT * from EventBooking`)).recordset;
    res.json({ booking });
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  const request = new mssql.Request();
  const eventQuery = await request.query(`SELECT * FROM RunningEvent Where id='${req.body.id}'`);
  if (eventQuery.recordset.length <= 0) {
    const err = new Error("Event not found");
    err.statusCode = 404;
    return next(err);
  }
  const event = eventQuery.recordset[0];
  if (event.isStop || Date.now() < new Date(event.startBookingTime) || Date.now() > new Date(event.endBookingTime)) {
    const err = new Error("Sorry!This event is no longer allow booking");
    err.statusCode = 400;
    return next(err);
  }

  const idEvent = event.id;
  const checkEvent = await request.query(
    `SELECT * FROM EventBooking where email='${req.body.email}' and eventId ='${idEvent}'`
  );
  if (checkEvent.recordset.length >= 1) {
    const err = new Error("You have booking this event");
    err.statusCode = 404;
    return next(err);
  }
  const code = voucherCodes.generate({
    length: 5,
    charset: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  })[0];

  try {
    await request.query(
      `INSERT INTO EventBooking(email,name,code,eventId) VALUES('${req.body.email}','${req.body.name}','${code}','${idEvent}')`
    );
  } catch (err) {
    return next(err);
  }
  const data = { to: req.body.email, subject: "Please verify your booking!!" };
  try {
    await emailService.sendEjsMail({
      template: "template1",
      templateVars: { name: req.body.name, code, url: process.env.IP },
      ...data,
    });
    res.send("Send mail successfully !");
  } catch (error) {
    res.status(500).send("Send mail fail !");
  }
};
const verifyEmail = async (req, res, next) => {
  const { slug } = req.params;
  const request = new mssql.Request();
  await request.query(`UPDATE EventBooking SET isEmailVerify=1 where code='${slug}'`);
  res.redirect(`/congrat`);
};

module.exports = {
  getAllBooking,
  createBooking,
  verifyEmail,
};
