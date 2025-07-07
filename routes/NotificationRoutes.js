const express = require("express");
const router = express.Router();

const {
  sendNotification,
  getNotifications,
} = require("../controllers/NotificationController");

router.post("/send", sendNotification);        
router.get("/", getNotifications);              

module.exports = router;
