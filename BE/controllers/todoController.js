const Todo = require("../models/Todo");

// Predefined categories and statuses
const validCategories = ["Work", "Home", "Personal", "Urgent"];
const validStatuses = ["Pending", "Completed"];

// CREATE TODO
const createTodoController = async (req, res) => {
  try {
    const { text, category, status, dueDate } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const todoCategory = validCategories.includes(category) ? category : "Work";
    const todoStatus = validStatuses.includes(status) ? status : "Pending";

    const todo = new Todo({
      text,
      category: todoCategory,
      status: todoStatus,
      user: req.user.id,
      dueDate,
    });
    console.log(req.body);
    const saved = await todo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL USER TODOS (WITH SERVER-SIDE FILTERING)
const getTodoController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const search = req.query.search || "";
    const category = req.query.category;
    const status = req.query.status;

    const query = {
      user: req.user.id,
      text: { $regex: search, $options: "i" }, // case-insensitive search
    };

    if (category && category !== "All") query.category = category;
    if (status && status !== "All") query.status = status;

    const options = {
      page,
      limit,
      sort: { order: 1, _id: -1 },
    };

    const result = await Todo.paginate(query, options);

    res.json({
      todos: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE TODO
const updateTodoController = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, category, status, dueDate } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const todoCategory = validCategories.includes(category) ? category : "Work";
    const todoStatus = validStatuses.includes(status) ? status : "Pending";

    const updated = await Todo.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { text, category: todoCategory, status: todoStatus, dueDate },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Todo not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE TODO
const deleteTodoController = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Todo.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!deleted) return res.status(404).json({ error: "Todo not found" });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// REORDER TODOS
const reorderTodos = async (req, res) => {
  const { todos } = req.body;
  try {
    for (let i = 0; i < todos.length; i++) {
      await Todo.findByIdAndUpdate(todos[i]._id, { order: i });
    }
    res.status(200).json({ message: "Order updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reorder todos" });
  }
};

module.exports = {
  createTodoController,
  getTodoController,
  updateTodoController,
  deleteTodoController,
  reorderTodos,
};
