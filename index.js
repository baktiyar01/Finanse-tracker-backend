const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const sequelize = require("./config/database");
const { createTokens, validateToken } = require("./JWT");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

//User registration

app.post("/signup", (req, res) => {
  const { user, pwd, confirmPassword } = req.body;
  if (pwd !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  // Check if the user already exists
  User.findOne({ where: { user: user } })
    .then((existingUser) => {
      if (existingUser) {
        // User already exists
        return res.json({ Message: "This user already exists" });
      }
      // Hash the password
      bcrypt.hash(pwd, 10, (err, hash) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Error hashing password" });
        }
        // Create the new user
        User.create({
          user: user,
          pwd: hash,
        })
          .then(() => {
            res.json("User registered successfully");
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Error creating user" });
          });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error checking existing user" });
    });
});

// User login
app.post("/login", async (req, res) => {
  const { user, pwd } = req.body;

  const users = await User.findOne({ where: { user: user } });
  if (!users) res.status(400).json({ error: "User Doesnt exist" });

  const dbPassword = users.pwd;
  bcrypt.compare(pwd, dbPassword).then((match) => {
    if (!match) {
      res
        .status(400)
        .json({ error: "Wrong Username and Password Combination!" });
    } else {
      const accessToken = createTokens(users);

      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      });
      res.send("Logged in");
    }
  });
});

app.get("/profile", validateToken, (req, res) => {
  res.send("Hello");
});

// // Add expense
// app.post("/budget/addExpense", (req, res) => {
//   const { budgetId, expenseName, amount } = req.body;

//   // Insert the new expense
//   const insertExpenseQuery =
//     "INSERT INTO expenses (budget_id, expense_name, amount) VALUES (?, ?, ?)";
//   db.query(
//     insertExpenseQuery,
//     [budgetId, expenseName, amount],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         return res.json({ Message: "Error inserting expense" });
//       }
//       res.send("Expense added successfully");
//     }
//   );
//   res.send("Success ade");
// });

// // Add budget
// app.post("/budget/addBudget", (req, res) => {
//   const { name, maxSpending } = req.body;

//   // Insert the new budget
//   const insertBudgetQuery =
//     "INSERT INTO budgets (name, max_spending) VALUES (?, ?)";
//   db.query(insertBudgetQuery, [name, maxSpending], (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.json({ Message: "Error inserting budget" });
//     }
//     res.send("Budget added successfully");
//   });
//   res.send("Success addb");
// });

// // View expenses
// app.get("/budget/expenses", (req, res) => {
//   const budgetId = req.query.budgetId;

//   // Retrieve expenses for a specific budget
//   const getExpensesQuery = "SELECT * FROM expenses WHERE budget_id = ?";
//   db.query(getExpensesQuery, [budgetId], (err, data) => {
//     if (err) {
//       console.log(err);
//       return res.json({ Message: "Error retrieving expenses" });
//     }
//     res.json(data);
//   });
//   res.send("Success ex");
// });

// app.get("/analytics", (req, res) => {
//   const userId = req.query.userId;

//   // Retrieve analytics data for a specific user
//   const getAnalyticsQuery = "SELECT * FROM analytics WHERE user_id = ?";
//   db.query(getAnalyticsQuery, [userId], (err, data) => {
//     if (err) {
//       console.log(err);
//       return res.json({ Message: "Error retrieving analytics data" });
//     }
//     res.json(data);
//   });
//   res.send("Success");
// });
sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("API listening on port 3001");
  });
});
