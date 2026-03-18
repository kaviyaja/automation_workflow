import { Link } from "react-router-dom";

function WorkflowTable({ workflows }) {

    return (
        <table border="1">

            <thead>
                <tr>
                    <th>Name</th>
                    <th>Version</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>

                {workflows.map((w) => (
                    <tr key={w.id}>

                        <td>{w.name}</td>

                        <td>{w.version}</td>

                        <td>{w.is_active ? "Active" : "Inactive"}</td>

                        <td>

                            <Link to={`/workflow/${w.id}`}>
                                Edit
                            </Link>

                            {" | "}

                            <Link to={`/execute/${w.id}`}>
                                Execute
                            </Link>

                        </td>

                    </tr>
                ))}

            </tbody>

        </table>
    );
}

export default WorkflowTable;