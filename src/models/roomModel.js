const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Room = sequelize.define(
  "rooms",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    room_number: DataTypes.STRING,
    price: DataTypes.DECIMAL(12, 2),
    description: DataTypes.TEXT,
    facilities: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM("available", "booked", "occupied"),
      defaultValue: "available",
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: false }
);

module.exports = Room;
