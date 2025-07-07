const mongoose = require("mongoose");
const Reservation = require("../models/Reservation");
const Book = require("../models/Book");
const NotificationController = require("../controllers/NotificationController");

const removeReservationFromBook = async (bookId, reservationId) => {
  const book = await Book.findById(bookId);
  if (!book) throw new Error("Book not found");

  book.reservations = book.reservations.filter(
    (resId) => resId.toString() !== reservationId
  );
  await book.save();
};

exports.reserveBook = async (req, res) => {
  const { bookId, userId } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.availabilityStatus !== "available") {
      return res.status(400).json({ message: "Book is not available for reservation" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const existingReservation = await Reservation.findOne({
      book: book._id,
      user: userObjectId,
      status: { $ne: "Returned" }
    });

    if (existingReservation) {
      return res.status(400).json({ message: "You have already reserved this book" });
    }

    const reservation = new Reservation({
      book: book._id,
      user: userObjectId,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    await reservation.save();

    book.availabilityStatus = "reserved";
    book.reservations.push(reservation._id);
    await book.save();

    res.status(201).json({ message: "Reservation created successfully", reservation });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).populate("book");
    res.status(200).json({ reservations });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reservations", error: error.message });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("book", "title author ISBN genre")
      .populate("user", "name email");

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelReservation = async (req, res) => {
  const { reservationId } = req.params;

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    const book = await Book.findById(reservation.book);
    if (book) {
      book.availabilityStatus = "available";
      await book.save();
    }

    await Reservation.findByIdAndDelete(reservationId);
    await removeReservationFromBook(reservation.book.toString(), reservationId);

    res.status(200).json({ message: "Reservation canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.notifyUser = async (req, res) => {
  const { reservationId } = req.params;

  try {
    const reservation = await Reservation.findById(reservationId)
      .populate("user")
      .populate("book");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    reservation.status = "Notified";
    await reservation.save();

    const user = reservation.user;
    const book = reservation.book;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const message = `Hello ${user.name},\n\nThe book "${book.title}" is now available for you to borrow. Please visit the library to pick it up.`;

    await NotificationController.sendNotification({
      userId: user._id,
      email: user.email,
      subject: "Book Reservation Notification",
      message,
    });

    res.status(200).json({ message: "User notified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getOverdueBooks = async (req, res) => {
  try {
    const overdueBooks = await Reservation.find({
      dueDate: { $lt: new Date() },
      status: "Reserved",
    })
      .populate("user", "email name")
      .populate("book", "title author");

    if (!overdueBooks.length) {
      return res.status(200).json({ message: "No overdue books." });
    }

    res.status(200).json(overdueBooks);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
