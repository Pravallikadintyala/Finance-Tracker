const Expense = require("../models/Expense");

// @desc    Get expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Make sure the logged in user matches the expense user
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
  try {
    const { title, amount, category, type, date, notes } = req.body;

    if (!title || !amount || !category || !type) {
      return res.status(400).json({ message: "Please add all required fields" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    if (type !== "income" && type !== "expense") {
      return res.status(400).json({ message: "Type must be either income or expense" });
    }

    const expense = await Expense.create({
      user: req.user.id,
      title,
      amount,
      category,
      type,
      date: date || Date.now(),
      notes,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Make sure the logged in user matches the expense user
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Make sure the logged in user matches the expense user
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await expense.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard summary
// @route   GET /api/expenses/dashboard
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });

    const totalIncome = expenses
      .filter((item) => item.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = expenses
      .filter((item) => item.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const currentBalance = totalIncome - totalExpense;
    
    // Latest 5 transactions
    const latestTransactions = expenses.slice(0, 5);

    res.status(200).json({
      totalIncome,
      totalExpense,
      currentBalance,
      latestTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get history
// @route   GET /api/expenses/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    // Sort by createdAt descending to get latest first
    const history = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  addExpense,
  updateExpense,
  deleteExpense,
  getDashboardSummary,
  getHistory,
};
