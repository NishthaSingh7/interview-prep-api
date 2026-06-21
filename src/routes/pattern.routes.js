const express = require("express");
const router = express.Router();
const patternController = require("../controllers/pattern.controller");

router.post("/", patternController.createPattern);

module.exports = router;
