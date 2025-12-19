const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const User = require("./userModel");
const Room = require("./roomModel");

const Booking = sequelize.define(
  "bookings",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    room_id: { type: DataTypes.INTEGER, allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    total_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "paid", "canceled"),
      defaultValue: "pending",
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: false }
);

Booking.belongsTo(User, { foreignKey: "user_id" });
Booking.belongsTo(Room, { foreignKey: "room_id" });

module.exports = Booking;
