const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
    try {
        const connected = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected:", connected.connection.host);
    } catch (err) {
        console.log("Error connecting to MongoDB:", err);
    }
};

module.exports = connectDB;
