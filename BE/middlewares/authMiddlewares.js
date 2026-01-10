const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach decoded user info to req.user
    req.user = decoded;

    next(); // move to next function/controller
  } catch (error) {
    return res.status(401).json({
      status: "failed",
      message: "Invalid or expired token",
    });
  }
};

module.exports = verifyToken;
