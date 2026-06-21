const express = require('express');
const ProbController = require('../controllers/problem.controller');

const router = express.Router();

// Create a new problem
router.post("/", ProbController.createProblem);

// Get all problems with filters
router.get("/", ProbController.getProblems);
router.get("/:slug", ProbController.getProblemBySlug);


module.exports = router;