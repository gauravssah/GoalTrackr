const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../utils/app-error");

async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return next(new AppError("User no longer exists", 401));
    }

    return next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
}

module.exports = { protect };
