const express = require("express");
const router = express.Router();

const complaintController = require("../controllers/complaintController");
const { verifyToken, adminOnly } = require("../middlewares/apiHandler");

router.post("/", verifyToken, complaintController.createComplaint);
router.get("/user", verifyToken, complaintController.getMyComplaints);

router.get("/", verifyToken, adminOnly, complaintController.getAllComplaints);
router.patch("/:id", verifyToken, adminOnly, complaintController.updateStatus);

module.exports = router;
