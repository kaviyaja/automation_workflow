const express = require("express");
const router = express.Router();

const executionController = require("../controllers/executionController");

// Execute a workflow
router.post("/workflows/:workflow_id/execute", executionController.executeWorkflow);

// Get execution details
router.get("/:id", executionController.getExecution);

module.exports = router;