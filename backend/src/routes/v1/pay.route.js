const express = require("express");
const { paymentController } = require("../../controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();
router.post("/mintQR", paymentController.mintQRPayment);
router.get("/execute", paymentController.executePayment);

module.exports = router;
