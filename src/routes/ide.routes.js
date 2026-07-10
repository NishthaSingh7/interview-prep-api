const express = require("express");
const router = express.Router();
const ideController = require("../controllers/ide.controller");

router.post("/run", ideController.runCode);

module.exports = router;
