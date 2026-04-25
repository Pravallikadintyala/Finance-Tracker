const express = require("express");
const router = express.Router();
const {
  getExpenses,
  getExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
  getDashboardSummary,
  getHistory,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, getDashboardSummary);
router.get("/history", protect, getHistory);

router.route("/").get(protect, getExpenses).post(protect, addExpense);

router
  .route("/:id")
  .get(protect, getExpenseById)
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

module.exports = router;
