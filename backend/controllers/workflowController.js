const pool = require("../db/db");
const { v4: uuidv4 } = require("uuid");

const Workflow = require("../models/workflow");

exports.createWorkflow = async (req, res) => {

  try {

    const { name, input_schema } = req.body;

    const workflow = await Workflow.create({
      name: name,
      input_schema: input_schema
    });

    res.json(workflow);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};


exports.getWorkflows = async (req, res) => {

  try {

    const workflows = await Workflow.findAll({
      order: [["created_at", "DESC"]]
    });

    res.json(workflows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};