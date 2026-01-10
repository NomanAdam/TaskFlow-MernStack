import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import OTPVerification from "./pages/OTPVerification";
import TodosPage from "./pages/TodosPage";
import LandingPage from "./pages/LandingPage";
import PrivateRoute from "./components/PrivateRoute";
import { CssBaseline } from "@mui/material";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/todos" replace /> : children;
};

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            }
          />

          <Route path="/verify-otp" element={<OTPVerification />} />

          {/* PRIVATE ROUTE */}
          <Route
            path="/todos"
            element={
              <PrivateRoute>
                <TodosPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
