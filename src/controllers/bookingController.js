const Booking = require("../models/bookingModel");
const Room = require("../models/roomModel");
const Response = require("../middlewares/responseHandler");
const { Op } = require("sequelize");

exports.createBooking = async (req, res) => {
  try {
    const { room_id, start_date, end_date } = req.body;

    const room = await Room.findByPk(room_id);
    if (!room) return Response.error(res, "Room not found", 404);

    if (room.status !== "available")
      return Response.error(res, "Room is not available", 400);

    const start = new Date(start_date);
    const end = new Date(end_date);

    if (end <= start) return Response.error(res, "Invalid date range", 400);

    const overlapping = await Booking.findOne({
      where: {
        room_id,
        status: ["pending", "paid"],
        start_date: { [Op.lt]: end_date },
        end_date: { [Op.gt]: start_date },
      },
    });

    if (overlapping) {
      return Response.error(res, "Room already booked for selected dates", 400);
    }

    let months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    if (end.getDate() >= start.getDate()) {
      months += 1;
    }

    if (months < 1) months = 1;

    const total_price = months * parseFloat(room.price);

    const booking = await Booking.create({
      user_id: req.user.id,
      room_id,
      start_date,
      end_date,
      total_price,
      status: "pending",
    });

    await room.update({ status: "booked" });

    return Response.success(res, "Booking created", booking);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const list = await Booking.findAll({
      where: { user_id: req.user.id },
      include: Room,
    });

    return Response.success(res, "User bookings", list);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const list = await Booking.findAll({ include: Room });
    return Response.success(res, "All bookings", list);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, { include: Room });
    if (!booking) return Response.error(res, "Booking not found", 404);

    return Response.success(res, "Booking detail", booking);
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findByPk(id);

    if (!booking) return Response.error(res, "Booking not found", 404);

    if (req.user.role === "user" && booking.user_id !== req.user.id) {
      return Response.error(
        res,
        "You cannot cancel someone else's booking",
        403
      );
    }

    await booking.update({ status: "canceled" });

    await Room.update(
      { status: "available" },
      { where: { id: booking.room_id } }
    );

    return Response.success(res, "Booking canceled");
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};
