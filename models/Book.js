const mongoose = require("mongoose");
const Reservation = require("./Reservation");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    ISBN: { type: String, required: true, unique: true },
    genre: { type: String, required: true },
    publicationYear: { type: Number, required: true },
    availabilityStatus: { type: String, enum: ["available", "unavailable", "reserved"], default: "available" },
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]  
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
