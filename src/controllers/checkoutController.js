const RoomHistory = require("../models/roomHistoryModel");
const Room = require("../models/roomModel");
const User = require("../models/userModel");
const Response = require("../middlewares/responseHandler");

exports.checkout = async (req, res) => {
  try {
    const { user_id, room_id } = req.body;

    const history = await RoomHistory.findOne({
      where: {
        user_id,
        room_id,
        status: "active",
      },
    });

    if (!history)
      return Response.error(res, "Active room history not found", 404);

    await history.update({
      end_date: new Date(),
      status: "finished",
    });

    await Room.update(
      { status: "available" },
      { where: { id: room_id } }
    );

    const activeRooms = await RoomHistory.count({
      where: {
        user_id,
        status: "active",
      },
    });

    if (activeRooms === 0) {
      await User.update(
        { is_active: false },
        { where: { id: user_id } }
      );
    }

    return Response.success(res, "Checkout success");
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};
