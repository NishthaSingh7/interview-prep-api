const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progress.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router.post("/streak-freeze", progressController.applyStreakFreeze);
router.get("/stats", progressController.getProgressStats);
router.get("/", progressController.getMyProgress);
router.post("/", progressController.createProgress);
router.put("/:id", progressController.updateProgress);
router.delete("/:id", progressController.deleteProgress);

module.exports = router;
