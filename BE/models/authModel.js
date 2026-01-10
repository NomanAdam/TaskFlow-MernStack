const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
});

// model name will become "users" collection in MongoDB
module.exports = mongoose.model("Users", userSchema);
