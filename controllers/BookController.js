const Book = require("../models/Book");
const { body, validationResult } = require("express-validator");

exports.addBook = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('ISBN').notEmpty().withMessage('ISBN is required').isLength({ min: 13 }).withMessage('ISBN should be 13 characters long'),
  body('genre').notEmpty().withMessage('Genre is required'),
  body('publicationYear').isNumeric().withMessage('Publication Year must be a number').isLength({ min: 4, max: 4 }).withMessage('Year should be 4 digits'),
  body('availabilityStatus').isIn(['available', 'unavailable']).withMessage('Availability status must be either available or unavailable'),
  
  async (req, res) => {
    const { title, author, ISBN, genre, publicationYear, availabilityStatus } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const book = new Book({ title, author, ISBN, genre, publicationYear, availabilityStatus });
      await book.save();
      res.status(201).json({ message: "Book added successfully", book });
    } catch (error) {
      res.status(500).json({ message: "Error while adding the book", error: error.message });
    }
  }
];

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: "Error while updating the book", error: error.message });
  }
};

exports.viewBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book details fetched successfully", book });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
};

exports.viewAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }
    res.status(200).json({ message: "Books list fetched successfully", books });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error: error.message });
  }
};

exports.searchBooks = async (req, res) => {
  const { term, filter } = req.query;
  try {
    let query = {};
    if (term && filter) {
      query[filter] = { $regex: term, $options: 'i' };
    }
    const books = await Book.find(query);
    if (books.length === 0) {
      return res.status(404).json({ message: "No books found matching your search" });
    }
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error searching books", error: error.message });
  }
};
