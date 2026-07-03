const express = require("express");
const router = express.Router();
const problemController = require("../controllers/problem.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/structure-stats", problemController.getStructureStats);
router.get("/", problemController.getProblems);
router.get("/:slug", problemController.getProblemBySlug);
router.post("/", protect, problemController.createProblem);
router.put("/:slug", problemController.updateProblem);
router.delete("/:slug", problemController.deleteProblem);

module.exports = router;
