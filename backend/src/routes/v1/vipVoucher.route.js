const express = require("express");
const { vipVoucherController } = require("../../controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();
router.post("/getvoucher", vipVoucherController.getVipVoucher);
router.post("/", vipVoucherController.createVipVoucher);
module.exports = router;
