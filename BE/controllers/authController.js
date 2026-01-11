const Users = require("../models/authModel");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");

//SignUp
const signupController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // check existing
    const existing = await Users.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);
    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser = new Users({
      username,
      email,
      password: hashed,
      otp,
      isVerified: false,
    });

    await newUser.save();

    // send otp email
    await sendEmail(
      email,
      "Your verification code",
      `<h3>Your TaskFlow OTP is ${otp}</h3>`
    );

    res
      .status(201)
      .json({ status: "success", message: "User created. OTP sent to email." });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
// verify otp
const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await Users.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ status: "failed", message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ status: "failed", message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    res.json({
      status: "success",
      message: "Email verified. You can login now.",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid email or password" });

    if (!user.isVerified)
      return res
        .status(401)
        .json({ status: "failed", message: "Please verify your email first" });

    const payload = { id: user._id, email: user.email };
    const token = generateToken(payload);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { email: user.email, username: user.username, token },
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  signupController,
  verifyOtpController,
  loginController,
};
