const express = require("express");
const auth = require("../../middlewares/auth");

const router = express.Router();
// const auth=require('../../middlewares/auth')
const { authController } = require("../../controllers");

router.post("/login", authController.login);
// router.post("/register", authController.register);
router.get("/", auth.verifyUser, authController.getCurrentUser);
/*
router.post("/send", async (req, res, next) => {
  const data = { to: "nmt14301@gmail.com", subject: "New event upcoming!!" };
  try {
    await emailService.sendEjsMail({
      template: "template1",
      templateVars: { name: "Nguyễn Minh Tuấn", code: 9999 },
      ...data,
    });
    res.send("Send mail successfully !");
  } catch (error) {
    res.status(500).send("Send mail fail !");
  }
});
*/
module.exports = router;
