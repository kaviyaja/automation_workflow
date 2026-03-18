const express = require("express");
const router = express.Router();

const workflowController = require("../controllers/workflowController");

// Create workflow
router.post("/", workflowController.createWorkflow);

// Get all workflows
router.get("/", workflowController.getWorkflows);

// Update workflow
router.put("/:id", workflowController.updateWorkflow);

module.exports = router;