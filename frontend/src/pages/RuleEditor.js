import { useState } from "react";
import { createRule } from "../services/api";

function RuleEditor({ stepId }) {

    const [condition, setCondition] = useState("");
    const [nextStep, setNextStep] = useState("");

    const handleCreate = async () => {

        await createRule(stepId, {
            condition,
            next_step_id: nextStep,
            priority: 1
        });

        setCondition("");
        setNextStep("");

        alert("Rule created");
    };

    return (
        <div>

            <input
                placeholder="Condition (amount > 1000)"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
            />

            <input
                placeholder="Next Step ID"
                value={nextStep}
                onChange={(e) => setNextStep(e.target.value)}
            />

            <button onClick={handleCreate}>
                Add Rule
            </button>

        </div>
    );
}

export default RuleEditor;