const jwt = require("jsonwebtoken");

function generateToken(payload) {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "3h" });
}

module.exports = generateToken;
