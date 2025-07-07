const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = express();

dotenv.config();


connectDB();


app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Routes
const bookRoutes = require("./routes/BookRoute");
const userRoutes = require("./routes/UserRoute");
const reservationRoutes = require("./routes/ReservationRoute");
const notificationRoutes = require("./routes/NotificationRoutes");
const borrowingRoutes = require("./routes/BorrowedRoute");
const reviewRoutes = require("./routes/ReviewRoute");


app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/borrowing", borrowingRoutes);
app.use("/api", reviewRoutes);


app.get("/", (req, res) => {
  res.send("📚 Welcome to the Library Management System API!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});


const port = process.env.PORT || 6001;
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
