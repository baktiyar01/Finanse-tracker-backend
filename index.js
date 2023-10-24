const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/database");
const { createTokens, validateToken } = require("./JWT");
const authRoutes = require("./routes/authRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const dataRoutes = require("./routes/dataRoutes");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://finance-tracker-frontend-dusky.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.get("/profile", verifyToken, (req, res) => {
  res.send("Hello");
});
app.use("/budget", budgetRoutes);
app.use("/data", dataRoutes);

sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("API listening on port 3001");
  });
});
