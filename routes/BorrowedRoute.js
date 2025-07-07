const express = require("express");
const router = express.Router();
const {
  borrowBook,
  returnBook,
  getOverdueBooks,
  getUserBorrowedBooks,
} = require("../controllers/BorrowedController");

const { isAuthenticated, isAdmin } = require("../middleware/authController");

router.post("/borrow", isAuthenticated, borrowBook);
router.put("/return/:id", isAuthenticated, returnBook);
router.get("/overdue", isAuthenticated, isAdmin, getOverdueBooks);
router.get("/borrowed", isAuthenticated, getUserBorrowedBooks); 

module.exports = router;
