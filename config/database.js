const { Sequelize } = require("sequelize");

// Create a new Sequelize instance
const sequelize = new Sequelize("diploma", "root", "Kletka1979@", {
  host: "localhost",
  dialect: "mysql",
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
