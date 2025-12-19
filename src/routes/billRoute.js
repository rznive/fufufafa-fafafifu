const express = require("express");
const router = express.Router();

const billController = require("../controllers/billController");
const { verifyToken, adminOnly } = require("../middlewares/apiHandler");

router.post("/", verifyToken, adminOnly, billController.createBill);
router.get("/", verifyToken, adminOnly, billController.getAllBills);
router.get("/user", verifyToken, billController.getUserBills);
router.patch("/:id", verifyToken, adminOnly, billController.updateBill);
router.delete("/:id", verifyToken, adminOnly, billController.deleteBill);

module.exports = router;
