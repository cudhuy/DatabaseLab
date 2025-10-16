const express = require("express");
const { entranceTicketController } = require("../../controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/", entranceTicketController.getTicket);
// router.get("/:id", auth.verifyStaff, entranceTicketController.getByParam);
router.post("/", entranceTicketController.createTicket);
router.patch("/", entranceTicketController.updateTicket);
router.patch("/payment", entranceTicketController.payTicket);
// router.delete("/:ticketId", entranceTicketController.deleteTicket);
router.post("/vip", entranceTicketController.createTicketForVip);
module.exports = router;
