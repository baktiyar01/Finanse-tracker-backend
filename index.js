const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Expense = require("./models/Expense");
const Budget = require("./models/Budget");
const Decimal = require("decimal.js");
const sequelize = require("./config/database");
const config = require("./config/auth.config");
const { createTokens, validateToken } = require("./JWT");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
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
      const token = jwt.sign(
        { user: users.user, id: users.id },
        config.secret,
        {
          allowInsecureKeySizes: true,
          expiresIn: "1800s", // 3 min
        }
      );
      res.status(200).json({ message: "Authentication successful", token });
    }
  });
});

app.get("/profile", verifyToken, (req, res) => {
  res.send("Hello");
});

// Add budget
app.post("/budget/addBudget", async (req, res) => {
  // {id }
  try {
    const { user_id, budget_name, maximum_spending } = req.body;
    // Insert the new budget
    const budget = await Budget.create({
      user_id,
      budget_name,
      maximum_spending,
    });

    res.json({ message: "Budget added successfully", budget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error inserting budget" });
  }
});
//Add expense
app.post("/budget/addExpense", async (req, res) => {
  const { user_id, expense_name, amount, date, budget_id } = req.body;

  try {
    // Create the expense using the Expense model
    const expense = await Expense.create({
      user_id,
      expense_name,
      amount,
      date,
      budget_id,
    });

    res.json({ expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

// View expenses
app.get("/expenses", async (req, res) => {
  try {
    const userId = req.query.userId;
    const expenses = await Expense.findAll({
      include: [
        {
          model: Budget,
          attributes: ["id", "user_id", "budget_name", "maximum_spending"],
          where: { user_id: userId }, // Filter by user ID
          include: {
            model: User,
            attributes: [], // Exclude user attributes from the result
          },
        },
      ],
    });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});
app.get("/budgets", async (req, res) => {
  try {
    const userId = req.query.userId;
    const budgets = await Budget.findAll({ where: { user_id: userId } });
    res.json(budgets);
  } catch (error) {
    console.error("Failed to fetch budgets:", error);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});
app.delete("/budgets/:id", async (req, res) => {
  const budgetId = req.params.id;

  try {
    // Find the budget by ID
    const budget = await Budget.findByPk(budgetId);

    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    // Delete the budget
    await budget.destroy();

    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete budget" });
  }
});

app.put("/budgets/:id", async (req, res) => {
  const budgetId = req.params.id;
  const { budget_name, maximum_spending } = req.body;

  try {
    // Find the budget by ID
    const budget = await Budget.findByPk(budgetId);

    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    // Update the budget data
    budget.budget_name = budget_name;
    budget.maximum_spending = maximum_spending;
    await budget.save();

    res.json({ message: "Budget updated successfully", budget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update budget" });
  }
});

// DELETE an expense by ID
app.delete("/expenses/:id", async (req, res) => {
  const expenseId = req.params.id;

  try {
    // Find the expense by ID
    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // Delete the expense
    await expense.destroy();

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});
// UPDATE an expense by ID
app.put("/expenses/:id", async (req, res) => {
  const expenseId = req.params.id;
  const { expense_name, amount, date, budget_id } = req.body;

  try {
    // Find the expense by ID
    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // Update the expense data
    expense.expense_name = expense_name;
    expense.amount = amount;
    expense.date = date;
    expense.budget_id = budget_id;
    await expense.save();

    res.json({ message: "Expense updated successfully", expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

app.post("/logout", (req, res) => {
  res.setHeader("x-access-token", "");
  res.json({ message: "Logged out successfully" });
});

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
