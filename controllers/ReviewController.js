const Review = require("../models/Review");
const Book = require("../models/Book");
const User = require("../models/User");

exports.addReview = async (req, res) => {
  const { title, userId, rating, comment } = req.body;

  try {
    const book = await Book.findOne({ title }).populate("reviews");
    if (!book) return res.status(404).json({ message: "Book not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const review = new Review({
      book: book._id,
      user: user._id,
      rating,
      comment: comment.trim()
    });

    await review.save();

    if (!Array.isArray(book.reviews)) book.reviews = [];
    book.reviews.push(review._id);
    await book.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getReviewsByBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findById(bookId).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name email"
      }
    });

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.status(200).json(book.reviews);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
