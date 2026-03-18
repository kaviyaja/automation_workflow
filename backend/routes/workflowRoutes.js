const express = require("express");
const router = express.Router();

const workflowController = require("../controllers/workflowController");

// Create workflow
router.post("/", workflowController.createWorkflow);

// Get all workflows
router.get("/", workflowController.getWorkflows);

module.exports = router;