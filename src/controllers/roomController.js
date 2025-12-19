const Room = require("../models/roomModel");
const Response = require("../middlewares/responseHandler");

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    return Response.success(res, "List rooms", rooms);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return Response.error(res, "Room not found", 404);
    return Response.success(res, "Detail room", room);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { price, description, facilities } = req.body;

    const count = await Room.count();
    const room_number = `RM-${String(count + 1).padStart(3, "0")}`;

    const newRoom = await Room.create({
      room_number,
      price,
      description,
      facilities,
    });

    return Response.success(res, "Room created", newRoom);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const id = req.params.id;
    const room = await Room.findByPk(id);
    if (!room) return Response.error(res, "Room not found", 404);

    await room.update(req.body);

    return Response.success(res, "Room updated", room);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const id = req.params.id;
    const room = await Room.findByPk(id);
    if (!room) return Response.error(res, "Room not found", 404);

    await room.destroy();
    return Response.success(res, "Room deleted");
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};
