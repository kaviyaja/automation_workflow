const express = require("express");
const router = express.Router();

const stepController = require("../controllers/stepController");

// Create step
router.post("/:workflow_id", stepController.createStep);

// Get steps of workflow
router.get("/:workflow_id", stepController.getSteps);

module.exports = router;