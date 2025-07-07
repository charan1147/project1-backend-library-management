const Borrowing = require("../models/Borrowed");
const Book = require("../models/Book");

exports.borrowBook = async (req, res) => {
  const { bookId, dueDate } = req.body;
  const userId = req.user._id; // Authenticated user

  try {
    const book = await Book.findById(bookId);
    if (!book || book.availabilityStatus === "unavailable") {
      return res.status(404).json({ message: "Book not available" });
    }

    const newBorrowing = new Borrowing({ userId, bookId, dueDate });
    await newBorrowing.save();

    book.availabilityStatus = "unavailable";
    await book.save();

    res.status(201).json({ message: "Book borrowed successfully", borrowing: newBorrowing });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.returnBook = async (req, res) => {
  const { id } = req.params;
  try {
    const borrowing = await Borrowing.findById(id);
    if (!borrowing) return res.status(404).json({ message: "Borrowing record not found" });

    borrowing.status = "returned";
    borrowing.returnDate = new Date();
    await borrowing.save();

    const book = await Book.findById(borrowing.bookId);
    if (book) {
      book.availabilityStatus = "available";
      await book.save();
    }

    res.status(200).json({ message: "Book returned successfully", borrowing });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getOverdueBooks = async (req, res) => {
  try {
    const overdueBooks = await Borrowing.find({
      dueDate: { $lt: new Date() },
      status: "Borrowed",
    })
      .populate("bookId")
      .populate("userId");

    res.status(200).json({ overdueBooks });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


exports.getUserBorrowedBooks = async (req, res) => {
  try {
    const userId = req.user._id; 

    const borrowedBooks = await Borrowing.find({ userId, status: "Borrowed" })
      .populate("bookId", "title")
      .sort({ borrowingDate: -1 });

    res.status(200).json(borrowedBooks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch borrowed books", error: err.message });
  }
};

