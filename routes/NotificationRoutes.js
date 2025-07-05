const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");

router.post("/send", NotificationController.sendNotification);
router.get("/", NotificationController.getNotifications);

module.exports = router;
