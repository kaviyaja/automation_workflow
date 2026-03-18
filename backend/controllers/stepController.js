const Step = require("../models/step");

exports.createStep = async (req, res) => {

  try {

    const { workflow_id } = req.params;
    const { name, step_type, step_order } = req.body;

    const step = await Step.create({
      workflow_id,
      name,
      step_type,
      step_order
    });

    res.json(step);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.getSteps = async (req, res) => {

  try {

    const { workflow_id } = req.params;

    const steps = await Step.findAll({
      where: { workflow_id },
      order: [["step_order", "ASC"]]
    });

    res.json(steps);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};