const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

const bookRoutes = require("./routes/BookRoute");
const userRoutes = require("./routes/UserRoute");
const reservationRoutes = require("./routes/ReservationRoute");
const notificationRoutes = require("./routes/NotificationRoutes");
const borrowingRoutes = require("./routes/BorrowedRoute");
const reviewRoutes = require("./routes/ReviewRoute");

const { isAuthenticated, isAdmin } = require("./middleware/authController");

app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations", isAuthenticated, reservationRoutes);
app.use("/api/notifications", isAuthenticated, notificationRoutes);
app.use("/api/borrowing", borrowingRoutes);
app.use("/api", reviewRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Library Management System API!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const port = process.env.PORT || 6001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
