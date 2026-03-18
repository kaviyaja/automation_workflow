const express = require("express");
const router = express.Router();

const ruleController = require("../controllers/ruleController");

// Create rule
router.post("/:step_id", ruleController.createRule);

// Get rules
router.get("/:step_id", ruleController.getRules);

module.exports = router;