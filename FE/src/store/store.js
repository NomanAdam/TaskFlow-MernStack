import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "../store/todosSlice";
const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});
export default store;
