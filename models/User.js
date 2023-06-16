const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Assuming you have a separate file for establishing the Sequelize connection

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  pwd: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
});

module.exports = User;
