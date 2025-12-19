const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Payment = sequelize.define(
  "payments",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    booking_id: { type: DataTypes.INTEGER, allowNull: false },
    room_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    payment_for: {
      type: DataTypes.ENUM("booking", "tagihan_bulanan"),
      allowNull: false,
    },
    order_id: { type: DataTypes.STRING },
    transaction_id: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "settlement",
        "expire",
        "cancel",
        "failure"
      ),
      defaultValue: "pending",
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: false }
);

module.exports = Payment;
