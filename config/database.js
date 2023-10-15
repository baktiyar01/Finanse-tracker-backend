const { Sequelize } = require("sequelize");

// Create a new Sequelize instance
const sequelize = new Sequelize({
  dialect: "mysql",
  host: "aqshasqlserver.mysql.database.azure.com",
  database: "diploma",
  username: "baktiyar",
  password: "Kletka1979",
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
