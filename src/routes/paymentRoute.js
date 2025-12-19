const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { verifyToken } = require("../middlewares/apiHandler");

router.post("/booking", verifyToken, paymentController.createPaymentBooking);
router.post("/webhook", paymentController.handleWebhook);

module.exports = router;
