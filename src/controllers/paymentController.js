const Booking = require("../models/bookingModel");
const Room = require("../models/roomModel");
const Payment = require("../models/paymentModel");
const RoomHistory = require("../models/roomHistoryModel");
const User = require("../models/userModel");
const Response = require("../middlewares/responseHandler");
const snap = require("../configs/midtrans");

exports.createPaymentBooking = async (req, res) => {
  try {
    const { booking_id } = req.body;

    const booking = await Booking.findByPk(booking_id);
    if (!booking) return Response.error(res, "Booking not found", 404);

    if (booking.user_id !== req.user.id) {
      return Response.error(res, "You cannot pay someone else's booking", 403);
    }

    if (booking.status === "paid") {
      return Response.error(res, "Booking already paid", 400);
    }

    if (booking.status === "canceled") {
      return Response.error(res, "Booking already canceled", 400);
    }

    const room = await Room.findByPk(booking.room_id);

    if (room.status === "occupied") {
      return Response.error(res, "Room already occupied", 400);
    }

    const order_id = `BOOK-${booking.id}-${Date.now()}`;

    await Payment.create({
      user_id: booking.user_id,
      booking_id: booking.id,
      room_id: booking.room_id,
      amount: booking.total_price,
      payment_for: "booking",
      order_id,
      status: "pending",
    });

    const parameter = {
      transaction_details: {
        order_id,
        gross_amount: booking.total_price,
      },
      customer_details: {
        email: req.user.email,
        first_name: req.user.name,
      },
    };

    const snapToken = await snap.createTransaction(parameter);

    return Response.success(res, "Snap token generated", {
      token: snapToken.token,
      redirect_url: snapToken.redirect_url,
    });
  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const notification = req.body;
    const { order_id, transaction_status, transaction_id } = notification;

    const payment = await Payment.findOne({ where: { order_id } });
    if (!payment) return res.status(404).end();

    await payment.update({
      transaction_id,
      status: transaction_status,
    });

    if (transaction_status === "settlement") {
      await Booking.update(
        { status: "paid" },
        { where: { id: payment.booking_id } }
      );

      await Room.update(
        { status: "occupied" },
        { where: { id: payment.room_id } }
      );

      await User.update(
        { is_active: true },
        { where: { id: payment.user_id } }
      );

      const existsHistory = await RoomHistory.findOne({
        where: {
          user_id: payment.user_id,
          room_id: payment.room_id,
          status: "active",
        },
      });

      if (!existsHistory) {
        await RoomHistory.create({
          user_id: payment.user_id,
          room_id: payment.room_id,
          start_date: new Date(),
          status: "active",
        });
      }
    }

    if (transaction_status === "expire" || transaction_status === "cancel") {
      await Booking.update(
        { status: "canceled" },
        { where: { id: payment.booking_id } }
      );

      await Room.update(
        { status: "available" },
        { where: { id: payment.room_id } }
      );
    }

    return res.status(200).json({ message: "OK" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
