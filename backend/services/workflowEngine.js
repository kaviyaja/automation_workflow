const Step = require("../models/step");
const Rule = require("../models/rule");
const Execution = require("../models/execution");
const sendEmail = require("./emailService");

exports.runWorkflow = async (workflow, data, executionId) => {
  let currentStepId = workflow.start_step_id;
  if (!currentStepId) {
    const firstStep = await Step.findOne({
      where: { workflow_id: workflow.id },
      order: [["step_order", "ASC"]]
    });
    currentStepId = firstStep?.id;
  }
  let iterations = 0;
  const MAX_STEPS = 50;

  const logs = [];

  const updateLogs = async (logEntry) => {
    logs.push({
      ...logEntry,
      executed_at: new Date()
    });
    await Execution.update(
      { logs: JSON.parse(JSON.stringify(logs)) },
      { where: { id: executionId } }
    );
  };

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
    const currentLog = {
      step_id: step.id,
      step_name: step.name,
      status: "running",
    };
    await updateLogs(currentLog);

    let result = null;
    let error = null;

    if (step.step_type === "email" || step.step_type === "notification") {
      try {
        const to = data.email || "sandhiyabk1723@example.com";
        const subject = data.subject || "Workflow Notification";
        const message = data.message || `Executed step: ${step.name}`;
        await sendEmail(to, subject, message);
        result = { sent_to: to };
      } catch (err) {
        console.log("Email sending error:", err);
        error = err.message;
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
        const evalResult = evalFunc(data);

        if (evalResult) {
          nextStep = rule.next_step_id;
          break;
        }
      } catch (err) {
        console.log("Rule error:", err);
      }
    }

    // Update log to completed
    const existingLogIndex = logs.findIndex(l => l.step_id === step.id && l.status === "running");
    if (existingLogIndex !== -1) {
      logs[existingLogIndex].status = error ? "failed" : "completed";
      logs[existingLogIndex].result = result;
      logs[existingLogIndex].error = error;
      await Execution.update(
        { logs: JSON.parse(JSON.stringify(logs)) },
        { where: { id: executionId } }
      );
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