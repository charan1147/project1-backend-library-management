const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAuthenticated = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
