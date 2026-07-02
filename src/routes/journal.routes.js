const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const journalController = require("../controllers/journal.controller");

router.use(protect);

router.get("/today", journalController.getToday);
router.get("/timeline", journalController.getTimeline);
router.get("/", journalController.listEntries);
router.post("/", journalController.upsertToday);

module.exports = router;
