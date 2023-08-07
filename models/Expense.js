const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Budget = require("./Budget");
const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
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

Expense.belongsTo(User, { foreignKey: "user_id" });
Expense.belongsTo(Budget, { foreignKey: "budget_id" });

module.exports = Expense;
