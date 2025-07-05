const Borrowing = require("../models/Borrowed");
const Book = require("../models/Book");

exports.borrowBook = async (req, res) => {
  const { bookId, userId, dueDate } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book || book.availabilityStatus === "unavailable") {
      return res.status(404).json({ message: "Book not available" });
    }

    const newBorrowing = new Borrowing({ userId, bookId: book._id, dueDate });
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
    if (!borrowing) {
      return res.status(404).json({ message: "Borrowing record not found" });
    }

    borrowing.status = "returned";
    borrowing.returnDate = Date.now();
    await borrowing.save();

    const book = await Book.findById(borrowing.bookId);
    book.availabilityStatus = "available";
    await book.save();

    res.status(200).json({ message: "Book returned successfully", borrowing });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getOverdueBooks = async (req, res) => {
  try {
    const overdueBooks = await Borrowing.find({ dueDate: { $lt: Date.now() }, status: "Borrowed" })
      .populate("bookId")
      .populate("userId");

    res.status(200).json({ overdueBooks });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
