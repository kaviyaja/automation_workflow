import { useParams } from "react-router-dom";
import StepList from "../components/StepList";

function WorkflowEditor() {

    const { id } = useParams();

    return (
        <div>

            <h2>Workflow Editor</h2>

            <StepList workflowId={id} />

        </div>
    );
}

export default WorkflowEditor;