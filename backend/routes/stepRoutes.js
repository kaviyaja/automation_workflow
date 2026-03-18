const express = require("express");
const router = express.Router();

const stepController = require("../controllers/stepController");

// Create step
router.post("/:workflow_id", stepController.createStep);

// Get steps of workflow
router.get("/:workflow_id", stepController.getSteps);

// Update step
router.put("/:id", stepController.updateStep);

// Delete step
router.delete("/:id", stepController.deleteStep);

module.exports = router;