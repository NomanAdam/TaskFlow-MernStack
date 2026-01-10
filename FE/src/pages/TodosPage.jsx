import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import api from "../api/axios";
import {
  fetchTodos,
  setSearch,
  setPage,
  setTodos,
  setFilterType,
  setFilterCategory,
} from "../store/todosSlice";

const TodosPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // --- REDUX STATE ---
  const search = useSelector((state) => state.todos.search);
  const totalPages = useSelector((state) => state.todos.totalPages);
  const page = useSelector((state) => state.todos.page);
  const todos = useSelector((state) => state.todos.todos || []);
  const filterCategory = useSelector((state) => state.todos.filterCategory);
  const filterType = useSelector((state) => state.todos.filterType);
  const loading = useSelector((state) => state.todos.loading);

  // --- LOCAL UI STATE ---
  const categories = ["Work", "Home", "Personal", "Urgent"];
  const [openAdd, setOpenAdd] = useState(false);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(null);
  const [category, setCategory] = useState(categories[0]);
  const [status, setStatus] = useState("Pending");
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [dueDate, setDueDate] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const BADGE_COLORS = {
    completed: { bg: "#dcfce7", text: "#15803d", border: "#86efac" },
    overdue: { bg: "#fee2e2", text: "#b91c1c", border: "#fca5a5" },
    upcoming: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
    neutral: { bg: "#f1f5f9", text: "#64748b", border: "#e2e8f0" },
  };

  // Helper to check if a task is overdue
  const isOverdue = (todo) => {
    if ((todo.status || "").toLowerCase() === "completed" || !todo.dueDate)
      return false;
    const diffHours = (new Date(todo.dueDate) - new Date()) / (1000 * 60 * 60);
    return diffHours <= 24;
  };

  const getStatusBadgeStyles = (todo) => {
    if ((todo.status || "").toLowerCase() === "completed")
      return BADGE_COLORS.completed;
    return isOverdue(todo) ? BADGE_COLORS.overdue : BADGE_COLORS.upcoming;
  };

  const getDueDateBadgeStyles = (todo) => {
    if ((todo.status || "").toLowerCase() === "completed")
      return BADGE_COLORS.completed;
    if (!todo.dueDate) return BADGE_COLORS.neutral;
    return isOverdue(todo) ? BADGE_COLORS.overdue : BADGE_COLORS.upcoming;
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const apiCategory =
        filterType === "Category" ? filterCategory : undefined;
      const apiStatus = ["Completed", "Pending"].includes(filterType)
        ? filterType
        : undefined;
      dispatch(
        fetchTodos({ page, search, category: apiCategory, status: apiStatus })
      );
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, filterCategory, filterType, dispatch]);

  const refresh = () => {
    const apiCategory = filterType === "Category" ? filterCategory : undefined;
    const apiStatus = ["Completed", "Pending"].includes(filterType)
      ? filterType
      : undefined;
    dispatch(
      fetchTodos({ page, search, category: apiCategory, status: apiStatus })
    );
  };

  const createTodo = async () => {
    if (!text.trim()) return;
    try {
      await api.post("/todos", {
        text,
        category,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
      });
      setText("");
      setOpenAdd(false);
      setDueDate("");
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodo = async (id) => {
    if (!editing.text.trim()) return;
    try {
      await api.put(`/todos/${id}`, {
        ...editing,
        dueDate: editing.dueDate ? new Date(editing.dueDate) : null,
      });
      setEditing(null);
      setOpenEdit(false);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const newTodos = Array.from(todos);
    const [reorderedItem] = newTodos.splice(result.source.index, 1);
    newTodos.splice(result.destination.index, 0, reorderedItem);
    dispatch(setTodos(newTodos));
    try {
      await api.post("/todos/reorder", { todos: newTodos });
    } catch (error) {
      console.error(error);
    }
  };

  const getFilterButtonStyle = (isActive) => ({
    py: 0.8,
    px: { xs: 1.5, md: 2.5 },
    borderRadius: "50px",
    textTransform: "none",
    fontSize: { xs: "0.75rem", md: "0.9rem" },
    fontWeight: 600,
    ...(isActive
      ? {
          color: "white",
          background: "linear-gradient(to right, #7b68ee, #9966cc)",
          boxShadow: "0 2px 8px rgba(135, 103, 237, 0.3)",
        }
      : {
          color: "#555",
          backgroundColor: "white",
          border: "1px solid #e0e0e0",
        }),
  });

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f4f7fe" }}>
      {/* --- NAVBAR --- */}
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)",
          boxShadow: 3,
        }}
      >
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: 1,
              display: { xs: "none", sm: "block" },
            }}
          >
            TASK FLOW
          </Typography>
          <TextField
            placeholder="Search tasks..."
            size="small"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            sx={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 2,
              width: { xs: "100%", sm: "400px" },
              input: { color: "white" },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAdd(true)}
              sx={{
                whiteSpace: "nowrap",
                background: "linear-gradient(to right, #6a5af9, #8a4dfb)",
                borderRadius: 2,
                px: 3,
                fontWeight: "bold",
                display: { xs: "none", md: "flex" },
              }}
            >
              Add Task
            </Button>
            <IconButton
              onClick={() => setOpenAdd(true)}
              sx={{ display: { xs: "flex", md: "none" }, color: "white" }}
            >
              <AddIcon />
            </IconButton>
            <IconButton onClick={handleLogout} sx={{ color: "white" }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- MAIN CONTENT --- */}
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: "auto" }}>
        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: { xs: "grid", md: "flex" },
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1,
              width: { xs: "100%", md: "auto" },
            }}
          >
            {categories.map((c) => (
              <Button
                key={c}
                onClick={() => {
                  dispatch(setFilterCategory(c));
                  dispatch(setFilterType("Category"));
                }}
                sx={{
                  ...getFilterButtonStyle(
                    filterCategory === c && filterType === "Category"
                  ),
                  width: { xs: "100%", md: "auto" },
                }}
              >
                {c}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: { xs: "center", md: "flex-end" },
              flex: { xs: "1 1 100%", md: "auto" },
            }}
          >
            {["All", "Pending", "Completed"].map((status) => (
              <Button
                key={status}
                onClick={() => dispatch(setFilterType(status))}
                sx={getFilterButtonStyle(filterType === status)}
              >
                {status}
              </Button>
            ))}
          </Box>
        </Box>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos-list">
            {(provided) => (
              <Box ref={provided.innerRef} {...provided.droppableProps}>
                {loading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 6 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : todos.length === 0 ? (
                  <Box
                    sx={{ textAlign: "center", py: 8, color: "text.secondary" }}
                  >
                    <Typography variant="h6">No tasks found</Typography>
                  </Box>
                ) : !isMobile ? (
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}
                  >
                    <Table>
                      <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Category
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>
                            Due Date
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700 }}>
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {todos.map((todo, index) => (
                          <Draggable
                            key={todo._id}
                            draggableId={todo._id}
                            index={index}
                          >
                            {(provided) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TableCell sx={{ fontWeight: 500 }}>
                                  {todo.text}
                                </TableCell>
                                <TableCell>{todo.category}</TableCell>
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      px: 1.5,
                                      py: 0.3,
                                      borderRadius: "20px",
                                      fontSize: "0.7rem",
                                      fontWeight: "bold",
                                      bgcolor: getStatusBadgeStyles(todo).bg,
                                      color: getStatusBadgeStyles(todo).text,
                                    }}
                                  >
                                    {todo.status}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: "inline-block",
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1.5,
                                      fontSize: "0.8rem",
                                      border: "1px solid",
                                      ...getDueDateBadgeStyles(todo),
                                      borderColor:
                                        getDueDateBadgeStyles(todo).border,
                                      // ONLY BOLD IF OVERDUE
                                      fontWeight: isOverdue(todo) ? 800 : 500,
                                    }}
                                  >
                                    {todo.dueDate
                                      ? new Date(todo.dueDate)
                                          .toISOString()
                                          .split("T")[0]
                                      : "—"}
                                  </Box>
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    onClick={() => {
                                      setEditing(todo);
                                      setOpenEdit(true);
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    onClick={() => {
                                      setDeleteId(todo._id);
                                      setOpenDelete(true);
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {todos.map((todo, index) => (
                      <Draggable
                        key={todo._id}
                        draggableId={todo._id}
                        index={index}
                      >
                        {(provided) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              borderLeft: "6px solid",
                              borderColor: getDueDateBadgeStyles(todo).border,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 700 }}
                              >
                                {todo.text}
                              </Typography>
                              <Box
                                sx={{
                                  px: 1,
                                  py: 0.2,
                                  borderRadius: 1,
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  bgcolor: getStatusBadgeStyles(todo).bg,
                                  color: getStatusBadgeStyles(todo).text,
                                }}
                              >
                                {todo.status}
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                // ONLY BOLD IF OVERDUE
                                sx={{ fontWeight: isOverdue(todo) ? 800 : 400 }}
                              >
                                {todo.category} •{" "}
                                {todo.dueDate
                                  ? new Date(todo.dueDate)
                                      .toISOString()
                                      .split("T")[0]
                                  : "No date"}
                              </Typography>
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setEditing(todo);
                                    setOpenEdit(true);
                                  }}
                                >
                                  <EditIcon fontSize="inherit" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    setDeleteId(todo._id);
                                    setOpenDelete(true);
                                  }}
                                >
                                  <DeleteIcon fontSize="inherit" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                  </Box>
                )}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>

        {/* Pagination */}
        {/* --- PROFESSIONAL PAGINATION --- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            mt: 6, // Increased margin for better breathing room
            pb: 4,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() => dispatch(setPage(page - 1))}
            disabled={page === 1}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#e0e0e0",
              color: page === 1 ? "grey.400" : "#1e3a8a",
            }}
          >
            Previous
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "white",
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: "#1e3a8a" }}
            >
              {page}
            </Typography>
            <Typography variant="body2" sx={{ mx: 0.5, color: "grey.500" }}>
              /
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "grey.700" }}
            >
              {totalPages}
            </Typography>
          </Box>

          <Button
            size="small"
            variant="outlined"
            onClick={() => dispatch(setPage(page + 1))}
            disabled={page === totalPages}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#e0e0e0",
              color: page === totalPages ? "grey.400" : "#1e3a8a",
            }}
          >
            Next
          </Button>
        </Box>
      </Box>

      {/* --- DIALOGS --- */}
      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Add New Task</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            label="Task"
            placeholder="What needs to be done?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="date"
            label="Due Date"
            value={dueDate}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setDueDate(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setOpenAdd(false)}
            fullWidth
            sx={{ bgcolor: "#f0f4f8" }}
          >
            Cancel
          </Button>
          <Button
            onClick={createTodo}
            fullWidth
            variant="contained"
            sx={{ background: "linear-gradient(to right, #6a5af9, #8a4dfb)" }}
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            fullWidth
            sx={{ bgcolor: "#f0f4f8" }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await deleteTodo(deleteId);
              setOpenDelete(false);
            }}
            fullWidth
            variant="contained"
            sx={{ background: "linear-gradient(to right, #6a5af9, #8a4dfb)" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Edit Task</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            label="Title"
            fullWidth
            value={editing?.text || ""}
            onChange={(e) => setEditing({ ...editing, text: e.target.value })}
            sx={{ mt: 1 }}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={editing?.category || categories[0]}
              onChange={(e) =>
                setEditing({ ...editing, category: e.target.value })
              }
              label="Category"
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={editing?.status || "Pending"}
              onChange={(e) =>
                setEditing({ ...editing, status: e.target.value })
              }
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="date"
            label="Due Date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={
              editing?.dueDate
                ? new Date(editing.dueDate).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setEditing({ ...editing, dueDate: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setOpenEdit(false)}
            fullWidth
            sx={{ bgcolor: "#f0f4f8" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => updateTodo(editing._id)}
            sx={{ background: "linear-gradient(to right, #6a5af9, #8a4dfb)" }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TodosPage;
