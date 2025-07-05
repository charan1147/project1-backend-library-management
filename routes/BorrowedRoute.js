const express = require('express');
const router = express.Router();
const { borrowBook, returnBook, getOverdueBooks } = require('../controllers/BorrowedController');
const { isAuthenticated, isAdmin } = require('../middleware/authController');

router.post('/borrow', isAuthenticated, borrowBook);
router.put('/return/:id', isAuthenticated, returnBook);
router.get('/overdue', isAuthenticated, isAdmin, getOverdueBooks);

module.exports = router;
