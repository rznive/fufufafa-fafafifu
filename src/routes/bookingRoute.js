const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const { verifyToken, adminOnly } = require("../middlewares/apiHandler");

router.post("/", verifyToken, bookingController.createBooking);
router.get("/user", verifyToken, bookingController.getUserBookings);

router.get("/", verifyToken, adminOnly, bookingController.getAllBookings);
router.get("/:id", verifyToken, bookingController.getBookingById);
router.put("/:id/cancel", verifyToken, bookingController.cancelBooking);

module.exports = router;
