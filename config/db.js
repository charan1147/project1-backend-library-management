const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not found in .env file");
}

const connectDB = async () => {
    try {
        const connected = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected:", connected.connection.host);
    } catch (err) {
        console.log("Error connecting to MongoDB:", err);
    }
};

module.exports = connectDB;
