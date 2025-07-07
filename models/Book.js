const mongoose = require("mongoose");
const Reservation = require("./Reservation");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    ISBN: { type: String, required: true, unique: true, trim: true },
    genre: { type: String, required: true, trim: true },
    publicationYear: { type: Number, required: true },
    availabilityStatus: {
      type: String,
      enum: ["available", "unavailable", "reserved"],
      default: "available",
    },
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
