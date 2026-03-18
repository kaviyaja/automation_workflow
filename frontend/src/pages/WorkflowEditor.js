import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Save, Play, Workflow, Code2 } from "lucide-react";
import { createWorkflow, getWorkflows, updateWorkflow } from "../services/api";
import StepList from "../components/StepList";
import { InlineLoader } from "../components/Loader";

export default function WorkflowEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [name, setName] = useState("");
  const [schema, setSchema] = useState(
    JSON.stringify({ amount: "number", email: "string", department: "string" }, null, 2)
  );
  const [schemaError, setSchemaError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [activeTab, setActiveTab] = useState("steps");

  // Fetch workflow info for display if editing
  useEffect(() => {
    if (!isNew) {
      getWorkflows()
        .then((res) => {
          const wf = (res.data || []).find((w) => String(w.id) === String(id));
          if (wf) {
            setWorkflowName(wf.name);
            setName(wf.name);
            setSchema(JSON.stringify(wf.input_schema || wf.inputSchema || {}, null, 2));
          }
        })
        .catch(() => {});
    }
  }, [id, isNew]);

  const validateSchema = (val) => {
    try {
      JSON.parse(val);
      setSchemaError("");
      return true;
    } catch {
      setSchemaError("Invalid JSON");
      return false;
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateSchema(schema)) return;
    setSubmitting(true);
    try {
      const res = await createWorkflow({ name, input_schema: JSON.parse(schema) });
      toast.success("Workflow created!");
      navigate(`/workflow/${res.data.id || res.data.workflow?.id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create workflow");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateSchema(schema)) return;
    setSubmitting(true);
    try {
      await updateWorkflow(id, { name, input_schema: JSON.parse(schema) });
      setWorkflowName(name);
      toast.success("Workflow settings updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update workflow");
    } finally {
      setSubmitting(false);
    }
  };

  if (isNew) {
    return (
      <div className="max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center">
              <Workflow size={18} className="text-brand-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">New Workflow</h2>
              <p className="text-xs text-slate-500">Define the name and input schema</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="label">Workflow Name *</label>
              <input
                className="input-field"
                placeholder="e.g. Purchase Approval"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="label flex items-center gap-1.5">
                <Code2 size={13} className="text-slate-400" />
                Input Schema
                <span className="text-slate-400 font-normal">(JSON)</span>
              </label>
              <textarea
                className={`input-field font-mono text-xs h-40 resize-none ${
                  schemaError ? "border-red-400 focus:ring-red-400" : ""
                }`}
                value={schema}
                onChange={(e) => {
                  setSchema(e.target.value);
                  if (e.target.value) validateSchema(e.target.value);
                }}
              />
              {schemaError && (
                <p className="text-xs text-red-500 mt-1">{schemaError}</p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !name.trim()}
                className="btn-primary flex-1"
              >
                {submitting ? <InlineLoader /> : <Save size={16} />}
                Create & Continue
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // Editing existing workflow
  return (
    <div className="space-y-6">
      {/* Workflow header banner */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center">
            <Workflow size={18} className="text-brand-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {workflowName || `Workflow #${id}`}
            </h2>
            <p className="text-xs text-slate-500">ID: {id}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/execute/${id}`)}
          className="btn-primary"
        >
          <Play size={14} />
          Run Workflow
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-0">
          {["steps", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab === "steps" ? "Steps & Rules" : tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "steps" ? (
        <StepList workflowId={id} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 max-w-xl"
        >
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="label">Workflow Name</label>
              <input
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Input Schema (JSON)</label>
              <textarea
                className={`input-field font-mono text-xs h-48 resize-none ${
                    schemaError ? "border-red-400 focus:ring-red-400" : ""
                }`}
                value={schema}
                onChange={(e) => {
                  setSchema(e.target.value);
                  if (e.target.value) validateSchema(e.target.value);
                }}
              />
              {schemaError && (
                <p className="text-xs text-red-500 mt-1">{schemaError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={submitting || !!schemaError}
              className="btn-primary w-full justify-center"
            >
              {submitting ? <InlineLoader /> : <Save size={16} />}
              Save Changes
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}