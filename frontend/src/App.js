import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WorkflowsPage from "./pages/WorkflowsPage";
import WorkflowEditor from "./pages/WorkflowEditor";
import ExecutionPage from "./pages/ExecutionPage";

function App() {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<WorkflowsPage />} />

                <Route
                    path="/workflow/:id"
                    element={<WorkflowEditor />}
                />

                <Route
                    path="/execute/:id"
                    element={<ExecutionPage />}
                />

            </Routes>
        </Router>
    );
}

export default App;