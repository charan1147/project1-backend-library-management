const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuthenticated = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ Fetch user from DB using id from token
    const user = await User.findById(decoded._id || decoded.id); // Match your token field

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    req.user = user; // ✅ Now you can access req.user._id, req.user.name, etc.
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid", error: error.message });
  }
};
