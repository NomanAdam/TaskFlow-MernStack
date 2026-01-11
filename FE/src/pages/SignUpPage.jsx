import React, { useState } from "react";
import { Card, CardContent, Snackbar, Button } from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "../styles.css";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

/*
  Validation:
   - username required, min 3 chars
   - email required & valid
   - password required, min 6 chars
*/
const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const submitSignup = async (values) => {
    try {
      const res = await fetch("https://taskflow-mernstack.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      setMessage(data.message || "Signup response");
      setOpen(true);

      // keep your original navigation behavior
      if (data.status === "success" || data.success === true) {
        setTimeout(() => {
          navigate(`/verify-otp?email=${values.email}`);
        }, 1000);
      }
    } catch (err) {
      setMessage("Network error");
      setOpen(true);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>

        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          validationSchema={SignupSchema}
          onSubmit={(values) => submitSignup(values)}
        >
          {({ values, handleChange }) => (
            <Form>
              <div className="input-wrapper">
                <Field
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={values.username}
                  onChange={handleChange}
                  className="auth-field"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="error"
                />
              </div>

              <div className="input-wrapper">
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                  className="auth-field"
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>

              <div className="input-wrapper password-box">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  className="auth-field"
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="small"
                sx={{
                  padding: "10px 16px",
                  textTransform: "none",
                  background: "linear-gradient(to right, #6a5af9, #8a4dfb)",
                  "&:hover": {
                    background: "linear-gradient(to right, #5a4ae0, #7a3ff0)",
                  },

                  borderRadius: "12px",
                }}
              >
                SIGN UP
              </Button>
            </Form>
          )}
        </Formik>

        <p className="auth-link">
          Already have an account? <Link to="/">Login</Link>
        </p>

        <Snackbar
          open={open}
          message={message}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
