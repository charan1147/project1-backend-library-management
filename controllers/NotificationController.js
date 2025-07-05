const Notification = require("../models/Notification");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');

dotenv.config();

exports.sendNotification = async (req, res) => {
    const { userId, email, subject, message } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);

        const notification = new Notification({
            user: userId,
            message,
            date: new Date(),
            read: false,
        });

        await notification.save();
        res.status(201).json({ message: "Notification sent and saved successfully.", notification });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.getNotifications = async (req, res) => {
    const userId = req.user._id;

    try {
        const notifications = await Notification.find({ user: userId }).sort({ date: -1 });

        if (notifications.length === 0) {
            return res.status(404).json({ message: "No notifications found." });
        }

        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications.", error: error.message });
    }
};
