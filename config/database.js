const { Sequelize } = require("sequelize");
require("dotenv").config();
// Create a new Sequelize instance
const sequelize = new Sequelize({
  dialect: "mysql",
  host: "bbqmafjjrmoskj8bgpyy-mysql.services.clever-cloud.com",
  database: "bbqmafjjrmoskj8bgpyy",
  username: process.env.DB_ADMIN,
  password: process.env.DB_PASSWORD,
  port: 3306,
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = sequelize;
