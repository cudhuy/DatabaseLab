const express = require("express");
const { dailyController } = require("../../controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();
router.get("/", dailyController.getCustomer);
router.post("/", dailyController.createCustomer);

module.exports = router;
