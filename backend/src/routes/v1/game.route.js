const express = require("express");
const { gameController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const upload = require("../../utils/multer");

const router = express.Router();
router.get("/", gameController.getAllGame);
router.post("/", upload.single("image"), gameController.createGame);
router.patch("/:id", upload.single("image"), gameController.updateGame);
router.delete("/:id", gameController.deleteGame);

module.exports = router;
