import { useParams } from "react-router-dom";
import { useState } from "react";
import { executeWorkflow } from "../services/api";

function ExecutionPage() {

    const { id } = useParams();

    const [amount, setAmount] = useState("");
    const [email, setEmail] = useState("");

    const runWorkflow = async () => {

        const res = await executeWorkflow(id, {
            data: {
                amount: Number(amount),
                email
            }
        });

        alert(res.data.alert);
    };

    return (
        <div>

            <h2>Execute Workflow</h2>

            <input
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={runWorkflow}>
                Execute
            </button>

        </div>
    );
}

export default ExecutionPage;