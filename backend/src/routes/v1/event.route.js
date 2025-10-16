const express = require("express");
const { eventController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const upload = require("../../utils/multer");

const router = express.Router();

router.get("/new", eventController.getNewEvent);
router.get("/running", eventController.getRunningEvent);
router.post("/", upload.single("image"), eventController.createNewEvent);
router.patch("/:id", upload.single("image"), eventController.updateEvent);
router.delete("/new/:id", eventController.deleteNewEvent);
router.delete("/running/:id", eventController.deleteRunningEvent);
router.post("/:id/sendmail", eventController.sentNotificationEmail);
router.patch("/:id/stop", eventController.stopEvent);
module.exports = router;
