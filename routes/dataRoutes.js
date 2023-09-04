const express = require("express");
const Budget = require("../models/Budget");
const Expense = require("../models/Expense");
const User = require("../models/User");
const { verifyToken } = require("../JWT");
const router = express.Router();

router.use(verifyToken);

router.get("/budgets", async (req, res) => {
  try {
    const userId = req.query.userId;
    const budgets = await Budget.findAll({ where: { user_id: userId } });
    res.json(budgets);
  } catch (error) {
    console.error("Failed to fetch budgets:", error);
    res.status(500).json({ error: "Failed to fetch budgets" });
  }
});
router.get("/expenses", async (req, res) => {
  try {
    const userId = req.query.userId;

    const expenses = await Expense.findAll({
      include: [
        {
          model: Budget,
          attributes: ["id", "user_id", "budget_name", "maximum_spending"],
          where: {
            user_id: userId,
          },
          include: {
            model: User,
            attributes: [],
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
router.delete("/budgets/:id", verifyToken, async (req, res) => {
  const budgetId = req.params.id;

  try {
    const budget = await Budget.findByPk(budgetId);

    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    await budget.destroy();

    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete budget" });
  }
});

router.delete("/expenses/:id", verifyToken, async (req, res) => {
  const expenseId = req.params.id;

  try {
    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    await expense.destroy();

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

module.exports = router;
