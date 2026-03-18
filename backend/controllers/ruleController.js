const Rule = require("../models/rule");

exports.createRule = async (req, res) => {

  try {

    const { step_id } = req.params;
    const { condition, next_step_id, priority } = req.body;

    const rule = await Rule.create({
      step_id,
      condition,
      next_step_id,
      priority
    });

    res.json(rule);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.getRules = async (req, res) => {

  try {

    const { step_id } = req.params;

    const rules = await Rule.findAll({
      where: { step_id },
      order: [["priority", "ASC"]]
    });

    res.json(rules);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { condition, next_step_id, priority } = req.body;
    await Rule.update(
      { condition, next_step_id, priority },
      { where: { id } }
    );
    const updated = await Rule.findByPk(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRule = async (req, res) => {
  try {
    const { id } = req.params;
    await Rule.destroy({ where: { id } });
    res.json({ message: "Rule deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};