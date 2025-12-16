const express = require("express");
const auth = require("../../middlewares/auth");
const userController = require("../../controllers/user.controller");

const router = express.Router();
router.route("/").post(userController.createUser).get(auth.verifyStaff, userController.getUsers);
router
  .route("/:userId")
  .get(auth.verifyStaff, userController.getUser)
  .patch(auth.verifyAdmin, auth.verifyPassword, userController.updateUser)
  .delete(auth.verifyAdmin, userController.deleteUser);

module.exports = router;
