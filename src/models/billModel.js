const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Bill = sequelize.define(
  "bills",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    user_id: { type: DataTypes.INTEGER, allowNull: false },

    room_id: { type: DataTypes.INTEGER, allowNull: false },

    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },

    due_date: { type: DataTypes.DATEONLY, allowNull: false },

    status: {
      type: DataTypes.ENUM("unpaid", "paid"),
      defaultValue: "unpaid",
    },

    description: { type: DataTypes.STRING, allowNull: true },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "bills",
    timestamps: false,
  }
);

const Room = require("./roomModel");
const User = require("./userModel");

Bill.belongsTo(Room, { foreignKey: "room_id" });
Room.hasMany(Bill, { foreignKey: "room_id" });

Bill.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Bill, { foreignKey: "user_id" });

module.exports = Bill;
