const voucherCodes = require("voucher-code-generator");
const { Pool } = require("pg");
const pool = new Pool();
const { emailService } = require("../services");

const getAllBooking = async (req, res, next) => {
  try {
    const booking = await pool.query("SELECT * from EventBooking");
    res.json({ booking: booking.rows });
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const eventQuery = await pool.query("SELECT * FROM RunningEvent Where id=$1", [req.body.id]);
    if (eventQuery.rows.length <= 0) {
      const err = new Error("Event not found");
      err.statusCode = 404;
      return next(err);
    }
    const event = eventQuery.rows[0];
    if (
      event.isstop ||
      event.isStop ||
      Date.now() < new Date(event.startbookingtime || event.startBookingTime) ||
      Date.now() > new Date(event.endbookingtime || event.endBookingTime)
    ) {
      const err = new Error("Sorry!This event is no longer allow booking");
      err.statusCode = 400;
      return next(err);
    }
    const idEvent = event.id;
    const checkEvent = await pool.query("SELECT * FROM EventBooking where email=$1 and eventId =$2", [
      req.body.email,
      idEvent,
    ]);
    if (checkEvent.rows.length >= 1) {
      const err = new Error("You have booking this event");
      err.statusCode = 404;
      return next(err);
    }
    const code = voucherCodes.generate({
      length: 5,
      charset: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    })[0];
    await pool.query("INSERT INTO EventBooking(email,name,code,eventId) VALUES($1,$2,$3,$4)", [
      req.body.email,
      req.body.name,
      code,
      idEvent,
    ]);
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
  } catch (err) {
    next(err);
  }
};
const verifyEmail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    await pool.query("UPDATE EventBooking SET isEmailVerify=1 where code=$1", [slug]);
    res.redirect(`/congrat`);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAllBooking,
  createBooking,
  verifyEmail,
};
