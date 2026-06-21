const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const reminderController = require("../controllers/reminder.controller");

router.get("/vapid-public-key", reminderController.getVapidPublicKey);
router.get("/preferences", protect, reminderController.getPreferences);
router.put("/preferences", protect, reminderController.updatePreferences);
router.post("/subscribe", protect, reminderController.subscribe);
router.post("/test", protect, reminderController.sendTestPush);
router.delete("/subscribe", protect, reminderController.unsubscribe);

module.exports = router;
