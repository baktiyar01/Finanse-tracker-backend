const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pwd: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
