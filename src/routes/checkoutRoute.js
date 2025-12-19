const express = require("express");
const router = express.Router();

const checkoutController = require("../controllers/checkoutController");
const { verifyToken, adminOnly } = require("../middlewares/apiHandler");

router.patch("/", verifyToken, adminOnly, checkoutController.checkout);

module.exports = router;
