const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const RoomHistory = sequelize.define(
  "room_history",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    room_id: { type: DataTypes.INTEGER, allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: true },
    status: {
      type: DataTypes.ENUM("active", "finished"),
      defaultValue: "active",
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    timestamps: false,
    tableName: "room_history",
  }
);

module.exports = RoomHistory;
