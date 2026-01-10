import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async ({ page, search, category, status }, { rejectWithValue }) => {
    try {
      const res = await api.get("/todos", {
        params: {
          page,
          search,
          category: category && category !== "All" ? category : undefined,
          status: status && status !== "All" ? status : undefined,
        },
      });
      return res.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
      return rejectWithValue(error.response?.data || "Error fetching todos");
    }
  }
);

const initialState = {
  search: "",
  todos: [],
  page: 1,
  totalPages: 1,
  error: null,
  filterType: "All",
  filterCategory: "Work",
};

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
      state.page = 1;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
      state.page = 1;
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload.todos || [];
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.error = action.payload;
        state.todos = [];
      });
  },
});

export const {
  setSearch,
  setPage,
  setTodos,
  setFilterCategory,
  setFilterType,
} = todosSlice.actions;
export default todosSlice.reducer;
