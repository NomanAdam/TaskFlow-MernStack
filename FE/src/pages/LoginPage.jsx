import React, { useState } from "react";
import axios from "../api/axios";
import { Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // 🔥 added
  //useNavigate() gives you a function that lets you change pages using JavaScript, not by clicking a link.
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.data.token);
      //
      navigate("/todos", { replace: true }); //Take user to /todos programmatically.
    } catch (err) {
      //?. optional chaining does it exist? other wise return undefine
      setErrorMessage(err.response?.data?.message || "Login failed"); // 🔥 replaced alert
    }
  };
  console.log("LOGIN PAGE LOADED");

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-wrapper password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* 🔥 Error message here */}
          {errorMessage && (
            <p
              style={{
                color: "red",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              padding: "10px 18px",
              textTransform: "none",
              background: "linear-gradient(to right, #6a5af9, #8a4dfb)",
              "&:hover": {
                background: "linear-gradient(to right, #5a4ae0, #7a3ff0)",
              },
              borderRadius: "12px",
            }}
          >
            {" "}
            LOGIN{" "}
          </Button>
        </form>

        <p className="auth-link">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
          {/* Link Lets user click and navigate without page reload */}
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
