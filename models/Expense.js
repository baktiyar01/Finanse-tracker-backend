const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    budget_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expense_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "expenses",
    timestamps: false,
  }
);

module.exports = Expense;
