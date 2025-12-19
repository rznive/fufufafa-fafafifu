const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Complaint = sequelize.define(
  "complaints",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    user_id: { type: DataTypes.INTEGER, allowNull: false },

    title: { type: DataTypes.STRING, allowNull: false },

    description: { type: DataTypes.TEXT, allowNull: false },

    photo: { type: DataTypes.STRING, allowNull: true },

    status: {
      type: DataTypes.ENUM("pending", "in_progress", "done"),
      defaultValue: "pending",
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "complaints",
    timestamps: false,
  }
);

module.exports = Complaint;
