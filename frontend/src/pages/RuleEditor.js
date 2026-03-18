import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Plus,
  GitBranch,
  ArrowRight,
  Trash2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { getRules, createRule, deleteRule, getSteps } from "../services/api";
import RuleTable from "../components/RuleTable";
import Loader, { InlineLoader } from "../components/Loader";

export default function RuleEditor() {
  const { stepId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const workflowId = params.get("workflowId");

  const [rules, setRules] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [condition, setCondition] = useState("");
  const [nextStepId, setNextStepId] = useState("");
  const [priority, setPriority] = useState(1);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rulesRes, stepsRes] = await Promise.all([
        getRules(stepId),
        workflowId ? getSteps(workflowId) : Promise.resolve({ data: [] }),
      ]);
      setRules(rulesRes.data || []);
      // Exclude current step from next-step options
      setSteps((stepsRes.data || []).filter((s) => String(s.id) !== String(stepId)));
    } catch {
      toast.error("Failed to load rules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [stepId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!condition.trim()) return;
    setSubmitting(true);
    try {
      await createRule(stepId, {
        condition: condition.trim(),
        next_step_id: nextStepId || null,
        priority: Number(priority),
      });
      setCondition("");
      setNextStepId("");
      setPriority(rules.length + 1);
      await loadData();
      toast.success("Rule added!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add rule");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      await deleteRule(ruleId);
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
      toast.success("Rule deleted");
    } catch {
      toast.error("Failed to delete rule");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center">
            <GitBranch size={18} className="text-violet-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Step Rules</h2>
            <p className="text-xs text-slate-500">
              Step ID: <span className="font-mono">{stepId}</span>
              {workflowId && (
                <>
                  {" "}·{" "}
                  <button
                    onClick={() => navigate(`/workflow/${workflowId}`)}
                    className="text-brand-600 hover:underline"
                  >
                    Back to Workflow
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Rule Form */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-5"
        >
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Plus size={14} className="text-brand-600" />
            Add Rule
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label">Condition *</label>
              <input
                className="input-field font-mono text-xs"
                placeholder='e.g. amount > 1000 or data.status == "urgent"'
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              />
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />
                Use field names from the workflow input schema
              </p>
            </div>

            <div>
              <label className="label">Next Step</label>
              {steps.length > 0 ? (
                <div className="relative">
                  <select
                    className="input-field appearance-none pr-9"
                    value={nextStepId}
                    onChange={(e) => setNextStepId(e.target.value)}
                  >
                    <option value="">— End of workflow —</option>
                    {steps.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (#{s.id})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              ) : (
                <input
                  className="input-field"
                  placeholder="Step ID (or leave blank for end)"
                  value={nextStepId}
                  onChange={(e) => setNextStepId(e.target.value)}
                  type="number"
                />
              )}
            </div>

            <div>
              <label className="label">Priority</label>
              <input
                className="input-field"
                type="number"
                min={1}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              />
              <p className="text-xs text-slate-400 mt-1">Lower = evaluated first</p>
            </div>

            <button
              type="submit"
              disabled={submitting || !condition.trim()}
              className="btn-primary w-full"
            >
              {submitting ? <InlineLoader /> : <ArrowRight size={15} />}
              Add Rule
            </button>
          </form>
        </motion.div>

        {/* Rules display */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-5"
        >
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <GitBranch size={14} className="text-slate-500" />
            Current Rules
            <span className="ml-auto badge bg-slate-100 text-slate-600">{rules.length}</span>
          </h3>

          {loading ? (
            <Loader text="Loading rules..." />
          ) : (
            <RuleTable rules={rules} onDelete={handleDeleteRule} />
          )}
        </motion.div>
      </div>
    </div>
  );
}