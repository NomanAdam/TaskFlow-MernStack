const express = require("express");
const router = express.Router();
const {
  createTodoController,
  getTodoController,
  updateTodoController,
  deleteTodoController,
  reorderTodos,
} = require("../controllers/todoController");
const verifyToken = require("../middlewares/authMiddlewares");

// CREATE a new todo
router.post("/", verifyToken, createTodoController);

// READ all todos
router.get("/", verifyToken, getTodoController);

// UPDATE a todo (toggle completed or change text)
router.put("/:id", verifyToken, updateTodoController);

// DELETE a todo
router.delete("/:id", verifyToken, deleteTodoController);
//reorder todods
router.post("/reorder", verifyToken, reorderTodos);
module.exports = router;
