import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  GitBranch,
  CheckSquare,
  Bell,
  Layers,
  ChevronRight,
  Edit2,
  X,
  Check,
} from "lucide-react";
import { getSteps, createStep, deleteStep, updateStep } from "../services/api";
import { InlineLoader } from "./Loader";

const TYPE_OPTIONS = ["task", "approval", "notification", "email"];

function StepTypeBadge({ type }) {
  const classes = {
    task: "badge-task",
    approval: "badge-approval",
    notification: "badge-notification",
  };
  return <span className={classes[type] || "badge bg-slate-100 text-slate-600"}>{type}</span>;
}

function EmptySteps() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
        <Layers size={20} className="text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-slate-600 mb-1">No steps yet</p>
      <p className="text-xs text-slate-400">Add the first step to build your workflow pipeline</p>
    </motion.div>
  );
}

export default function StepList({ workflowId }) {
  const navigate = useNavigate();
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [stepType, setStepType] = useState("task");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");

  const loadSteps = async () => {
    try {
      const res = await getSteps(workflowId);
      setSteps(res.data || []);
    } catch {
      toast.error("Failed to load steps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSteps();
    // eslint-disable-next-line
  }, [workflowId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await createStep(workflowId, {
        name: name.trim(),
        step_type: stepType,
        step_order: steps.length + 1,
      });
      setName("");
      await loadSteps();
      toast.success("Step added successfully!");
    } catch {
      toast.error("Failed to add step");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (stepId) => {
    try {
      await deleteStep(stepId);
      setSteps((prev) => prev.filter((s) => s.id !== stepId));
      toast.success("Step removed");
    } catch {
      toast.error("Failed to delete step");
    }
  };

  const startEdit = (step) => {
    setEditingId(step.id);
    setEditName(step.name);
    setEditType(step.step_type);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditType("");
  };

  const handleUpdate = async (stepId) => {
    if (!editName.trim()) return;
    try {
      await updateStep(stepId, {
        name: editName.trim(),
        step_type: editType,
      });
      setEditingId(null);
      await loadSteps();
      toast.success("Step updated");
    } catch {
      toast.error("Failed to update step");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Step Form */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Add New Step</h3>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="label">Step Name</label>
            <input
              className="input-field"
              placeholder="e.g. Manager Approval"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="sm:w-44">
            <label className="label">Type</label>
            <select
              className="input-field"
              value={stepType}
              onChange={(e) => setStepType(e.target.value)}
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
              {submitting ? <InlineLoader /> : <Plus size={16} />}
              Add Step
            </button>
          </div>
        </form>
      </div>

      {/* Steps List */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">
          {steps.length} Step{steps.length !== 1 ? "s" : ""}
        </h3>

        {loading ? (
          <div className="card p-8 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full"
            />
          </div>
        ) : steps.length === 0 ? (
          <div className="card">
            <EmptySteps />
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {steps.map((step, i) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-4 flex items-center gap-4 group hover:border-brand-200 transition-colors"
                >
                  {/* Order Badge */}
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold text-slate-500">
                    {i + 1}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1 min-w-0">
                    {editingId === step.id ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          className="input-field flex-1 py-1 px-2 text-xs"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                        />
                        <select
                          className="input-field py-1 px-2 text-xs w-32"
                          value={editType}
                          onChange={(e) => setEditType(e.target.value)}
                        >
                          {TYPE_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 text-sm truncate">
                            {step.name}
                          </span>
                          <StepTypeBadge type={step.step_type} />
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Step ID: {step.id}</p>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingId === step.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(step.id)}
                          className="btn-ghost text-emerald-600 hover:bg-emerald-50 p-1.5"
                          title="Save"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn-ghost text-slate-400 hover:bg-slate-100 p-1.5"
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(step)}
                          className="btn-ghost text-slate-500 hover:bg-slate-100 p-1.5"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => navigate(`/rules/${step.id}?workflowId=${workflowId}`)}
                          className="btn-ghost text-xs gap-1.5 text-brand-600 hover:bg-brand-50"
                        >
                          <GitBranch size={13} />
                          Rules
                          <ChevronRight size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(step.id)}
                          className="btn-ghost text-red-500 hover:bg-red-50 hover:text-red-700 p-1.5"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}