import { useEffect, useState } from "react";
import { getWorkflows, createWorkflow } from "../services/api";
import WorkflowTable from "../components/WorkflowTable";

function WorkflowsPage() {

    const [workflows, setWorkflows] = useState([]);
    const [name, setName] = useState("");

    const loadWorkflows = async () => {
        const res = await getWorkflows();
        setWorkflows(res.data);
    };

    useEffect(() => {
        loadWorkflows();
    }, []);

    const handleCreate = async () => {

        const data = {
            name,
            input_schema: {
                amount: "number",
                department: "string",
                priority: "string"
            }
        };

        await createWorkflow(data);

        setName("");

        loadWorkflows();
    };

    return (
        <div>

            <h2>Workflows</h2>

            <input
                placeholder="Workflow Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <button onClick={handleCreate}>
                Create Workflow
            </button>

            <WorkflowTable workflows={workflows} />

        </div>
    );
}

export default WorkflowsPage;