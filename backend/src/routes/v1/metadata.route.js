const express = require("express");
const { metaDataController } = require("../../controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();
router.get("/ticket", metaDataController.getTicketStatistic);
router.get("/game", metaDataController.getGameMetaData);
router.get("/totalprofit", metaDataController.getTotalProfit);
router.get("/vip", metaDataController.getVipMetaData);
module.exports = router;
