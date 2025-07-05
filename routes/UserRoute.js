const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { isAuthenticated, isAdmin } = require('../middleware/authController');
const User = require('../models/User');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', isAuthenticated, userController.getUserProfile);
router.put('/profile', isAuthenticated, userController.updateUserProfile);
router.put('/password', isAuthenticated, userController.changePassword);
router.delete('/delete', isAuthenticated, userController.deleteUser);
router.get('/users', isAuthenticated, isAdmin, userController.getAllUsers);
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
