const express = require("express");
const { vipController } = require("../../controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();
router.get("/", vipController.getAllVip);
router.get("/byid/:uuid", vipController.getVipById);
router.get("/bycode/:code", vipController.getVipByCode);
router.post("/phone", vipController.getVipbyPhone);
router.post("/", vipController.createVip);
router.patch("/", vipController.updateVip);
router.post("/delete", vipController.deleteVip);
module.exports = router;
