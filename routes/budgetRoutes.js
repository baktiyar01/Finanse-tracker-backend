const express = require("express");
const { verifyToken } = require("../JWT");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

const router = express.Router();

router.use(verifyToken);

router.post("/addBudget", async (req, res) => {
  try {
    const { user_id, budget_name, maximum_spending } = req.body;

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

router.post("/addExpense", async (req, res) => {
  const { user_id, expense_name, amount, date, budget_id } = req.body;

  try {
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

module.exports = router;
