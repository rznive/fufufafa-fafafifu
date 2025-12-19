const { Op, fn, col, where } = require("sequelize");
const Bill = require("../models/billModel");
const Room = require("../models/roomModel");
const RoomHistory = require("../models/roomHistoryModel");
const Response = require("../middlewares/responseHandler");

exports.createBill = async (req, res) => {
  try {
    const { user_id, room_id, amount, due_date, description } = req.body;

    const room = await Room.findByPk(room_id);
    if (!room) return Response.error(res, "Room not found", 404);

    const activeStay = await RoomHistory.findOne({
      where: {
        user_id,
        room_id,
        status: "active",
      },
    });

    if (!activeStay)
      return Response.error(res, "User is not active in this room", 400);

    const date = new Date(due_date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const exists = await Bill.findOne({
      where: {
        user_id,
        room_id,
        [Op.and]: [
          where(fn("MONTH", col("due_date")), month),
          where(fn("YEAR", col("due_date")), year),
        ],
      },
    });

    if (exists)
      return Response.error(res, "Bill for this month already exists", 400);

    const bill = await Bill.create({
      user_id,
      room_id,
      amount,
      due_date,
      description,
    });

    return Response.success(res, "Bill created", bill);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.getAllBills = async (req, res) => {
  try {
    const list = await Bill.findAll({ include: Room });
    return Response.success(res, "All bills", list);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.getUserBills = async (req, res) => {
  try {
    const list = await Bill.findAll({
      where: { user_id: req.user.id },
      include: Room,
    });

    return Response.success(res, "User bills", list);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.updateBill = async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) return Response.error(res, "Bill not found", 404);

    await bill.update(req.body);

    return Response.success(res, "Bill updated", bill);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) return Response.error(res, "Bill not found", 404);

    await bill.destroy();

    return Response.success(res, "Bill deleted");
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};
