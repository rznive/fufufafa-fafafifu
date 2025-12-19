const express = require("express");
const router = express.Router();

const roomController = require("../controllers/roomController");
const { verifyToken, adminOnly } = require("../middlewares/apiHandler");

router.get("/", roomController.getRooms);
router.get("/:id", roomController.getRoomById);

router.post("/", verifyToken, adminOnly, roomController.createRoom);
router.put("/:id", verifyToken, adminOnly, roomController.updateRoom);
router.delete("/:id", verifyToken, adminOnly, roomController.deleteRoom);

module.exports = router;
