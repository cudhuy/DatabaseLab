const express = require("express");
const { eventBookingController } = require("../../controllers");

const router = express.Router();
router.get("/", eventBookingController.getAllBooking);
router.post("/", eventBookingController.createBooking);
router.get("/verify/:slug", eventBookingController.verifyEmail);

module.exports = router;
