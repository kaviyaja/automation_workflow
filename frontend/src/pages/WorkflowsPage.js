import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, X, Workflow, Search } from "lucide-react";
import { getWorkflows, createWorkflow } from "../services/api";
import WorkflowTable from "../components/WorkflowTable";
import Loader, { InlineLoader } from "../components/Loader";

function CreateModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [schema, setSchema] = useState(
    JSON.stringify({ amount: "number", email: "string", department: "string" }, null, 2)
  );
  const [submitting, setSubmitting] = useState(false);
  const [schemaError, setSchemaError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSchema(schema)) return;
    setSubmitting(true);
    try {
      await createWorkflow({ name, input_schema: JSON.parse(schema) });
      toast.success("Workflow created!");
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create workflow");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="modal-box"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Create Workflow</h2>
            <p className="text-xs text-slate-500 mt-0.5">Configure your new automation workflow</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 -mr-1.5">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
            <label className="label">
              Input Schema
              <span className="ml-1 text-slate-400 font-normal">(JSON)</span>
            </label>
            <textarea
              className={`input-field font-mono text-xs h-36 resize-none ${
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

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="btn-primary flex-1"
            >
              {submitting ? <InlineLoader /> : <Plus size={16} />}
              Create Workflow
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const loadWorkflows = async () => {
    try {
      const res = await getWorkflows();
      setWorkflows(res.data || []);
    } catch {
      toast.error("Failed to load workflows");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const filtered = workflows.filter((w) =>
    w.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input-field pl-9 py-2"
              placeholder="Search workflows..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus size={16} />
          Create Workflow
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Workflows", value: workflows.length, color: "brand" },
          {
            label: "Active",
            value: workflows.filter((w) => w.is_active).length,
            color: "emerald",
          },
          {
            label: "Inactive",
            value: workflows.filter((w) => !w.is_active).length,
            color: "slate",
          },
        ].map(({ label, value, color }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4"
          >
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className={`text-2xl font-bold mt-1 text-${color}-600`}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Workflow size={16} className="text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">All Workflows</h2>
          <span className="ml-auto badge bg-slate-100 text-slate-600">
            {filtered.length}
          </span>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <WorkflowTable workflows={filtered} />
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <CreateModal
            onClose={() => setShowModal(false)}
            onCreated={loadWorkflows}
          />
        )}
      </AnimatePresence>
    </div>
  );
}