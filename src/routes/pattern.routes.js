const express = require("express");
const router = express.Router();
const patternController = require("../controllers/pattern.controller");

router.get("/", patternController.getPatterns);
router.post("/", patternController.createPattern);
router.get("/:slug", patternController.getPatternBySlug);
router.put("/:slug", patternController.updatePattern);
router.delete("/:slug", patternController.deletePattern);

module.exports = router;
