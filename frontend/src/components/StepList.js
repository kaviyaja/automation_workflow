import { useEffect, useState } from "react";
import { getSteps, createStep } from "../services/api";
import RuleEditor from "../pages/RuleEditor";

function StepList({ workflowId }) {

    const [steps, setSteps] = useState([]);
    const [name, setName] = useState("");
    const [type, setType] = useState("");

    const loadSteps = async () => {
        const res = await getSteps(workflowId);
        setSteps(res.data);
    };

    useEffect(() => {
        loadSteps();
    }, []);

    const handleCreate = async () => {

        await createStep(workflowId, {
            name,
            step_type: type,
            step_order: steps.length + 1
        });

        setName("");
        setType("");

        loadSteps();
    };

    return (
        <div>

            <h3>Steps</h3>

            <input
                placeholder="Step Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                placeholder="Step Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
            />

            <button onClick={handleCreate}>
                Add Step
            </button>

            {steps.map((s) => (

                <div key={s.id}>

                    <h4>{s.name}</h4>

                    <RuleEditor stepId={s.id} />

                </div>

            ))}

        </div>
    );
}

export default StepList;