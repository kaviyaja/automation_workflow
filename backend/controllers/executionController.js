const Workflow = require("../models/workflow");
const Execution = require("../models/execution");
const workflowEngine = require("../services/workflowEngine");

exports.executeWorkflow = async (req, res) => {

  try {

    const { workflow_id } = req.params;
    const { data } = req.body;

    const workflow = await Workflow.findByPk(workflow_id);

    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    const execution = await Execution.create({
      workflow_id,
      status: "in_progress",
      data
    });

    const result = await workflowEngine.runWorkflow(
      workflow,
      data,
      execution.id
    );

    res.json({
      message: "Workflow executed successfully",
      execution_id: execution.id,
      alert: "Workflow completed successfully"
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.getExecution = async (req, res) => {

  try {

    const { id } = req.params;

    const execution = await Execution.findByPk(id);

    res.json(execution);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};