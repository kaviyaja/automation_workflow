const Step = require("../models/step");
const Rule = require("../models/rule");
const Execution = require("../models/execution");
const sendEmail = require("./emailService");

exports.runWorkflow = async (workflow, data, executionId) => {
  let currentStepId = workflow.start_step_id;
  let iterations = 0;
  const MAX_STEPS = 50;

  while (currentStepId && iterations < MAX_STEPS) {
    iterations++;

    const step = await Step.findByPk(currentStepId);

    if (!step) {
      console.log("Step not found");
      await Execution.update(
        {
          status: "failed",
          ended_at: new Date()
        },
        {
          where: { id: executionId }
        }
      );
      return {
        message: "Workflow failed: Step not found",
        executionId
      };
    }

    console.log("Executing step:", step.name);

    if (step.step_type === "email") {
      try {
        const to = data.email || "sandhiyabk1723@example.com";
        const subject = data.subject || "Workflow Notification";
        const message = data.message || `Executed step: ${step.name}`;
        await sendEmail(to, subject, message);
      } catch (err) {
        console.log("Email sending error:", err);
      }
    }

    const rules = await Rule.findAll({
      where: { step_id: step.id },
      order: [["priority", "ASC"]]
    });

    let nextStep = null;

    for (const rule of rules) {

      if (rule.condition === "DEFAULT") {
        nextStep = rule.next_step_id;
        break;
      }

      try {

        const evalFunc = new Function("data", `with(data){ return ${rule.condition}; }`);
        const result = evalFunc(data);

        if (result) {
          nextStep = rule.next_step_id;
          break;
        }

      } catch (err) {
        console.log("Rule error:", err);
      }

    }

    console.log("Step completed:", step.name);
    currentStepId = nextStep;
  }

  if (iterations >= MAX_STEPS) {
    console.log("Max iterations reached, breaking loop.");
    await Execution.update(
      {
        status: "failed",
        ended_at: new Date()
      },
      {
        where: { id: executionId }
      }
    );
    return {
      message: "Workflow failed: Infinite loop detected",
      executionId
    };
  }

  await Execution.update(
    {
      status: "completed",
      ended_at: new Date()
    },
    {
      where: { id: executionId }
    }
  );

  return {
    message: "Workflow completed",
    executionId
  };
};