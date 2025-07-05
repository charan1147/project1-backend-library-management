const express = require("express");
const router = express.Router();
const { addBook, updateBook, viewAllBooks, viewBookById, deleteBook, searchBooks } = require("../controllers/BookController");
const { isAuthenticated, isAdmin } = require("../middleware/authController");

router.post('/add', isAuthenticated, isAdmin, addBook);
router.put('/update/:id', isAuthenticated, isAdmin, updateBook);
router.get('/view', viewAllBooks);
router.get('/view/:id', viewBookById);
router.delete('/delete/:id', isAuthenticated, isAdmin, deleteBook);
router.get('/search', searchBooks);

module.exports = router;
