const express = require("express");
const {
  signupController,
  verifyOtpController,
  loginController,
} = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post("/signup", signupController);
authRouter.post("/verify-otp", verifyOtpController);
authRouter.post("/login", loginController);
module.exports = authRouter;
