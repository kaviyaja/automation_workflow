import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import WorkflowsPage from "./pages/WorkflowsPage";
import WorkflowEditor from "./pages/WorkflowEditor";
import RuleEditor from "./pages/RuleEditor";
import ExecutionPage from "./pages/ExecutionPage";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#0f172a",
            fontSize: "13px",
            fontWeight: 500,
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06)",
            padding: "10px 14px",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
      <Layout>
        <Routes>
          <Route path="/" element={<WorkflowsPage />} />
          <Route path="/workflow/:id" element={<WorkflowEditor />} />
          <Route path="/execute/:id" element={<ExecutionPage />} />
          <Route path="/rules/:stepId" element={<RuleEditor />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;