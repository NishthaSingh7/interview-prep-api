const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progress.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);

router.get("/stats", progressController.getProgressStats);
router.get("/", progressController.getMyProgress);
router.post("/", progressController.createProgress);
router.put("/:id", progressController.updateProgress);
router.delete("/:id", progressController.deleteProgress);

module.exports = router;
