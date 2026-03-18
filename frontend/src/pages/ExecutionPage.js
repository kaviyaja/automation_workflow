import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertCircle,
} from "lucide-react";
import { executeWorkflow, getExecution } from "../services/api";
import { InlineLoader } from "../components/Loader";

const STATUS_ICONS = {
  completed: <CheckCircle2 size={15} className="text-emerald-500" />,
  failed: <XCircle size={15} className="text-red-500" />,
  running: <Clock size={15} className="text-blue-500 animate-spin" />,
  pending: <Clock size={15} className="text-amber-500" />,
};

const STATUS_CLASSES = {
  completed: "badge-completed",
  failed: "badge-failed",
  running: "badge-running",
  pending: "badge-pending",
};

function StepLog({ log, index, isActive }) {
  const [expanded, setExpanded] = useState(false);
  const status = log.status?.toLowerCase() || "pending";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`relative pl-8 pb-5 ${
        index === 0 ? "" : "before:absolute before:left-3.5 before:top-0 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 before:-ml-px"
      }`}
    >
      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
          status === "completed"
            ? "bg-emerald-50 border-emerald-200"
            : status === "failed"
            ? "bg-red-50 border-red-200"
            : status === "running"
            ? "bg-blue-50 border-blue-200"
            : "bg-slate-50 border-slate-200"
        } ${isActive ? "ring-2 ring-offset-1 ring-brand-400" : ""}`}
      >
        {STATUS_ICONS[status] || <Clock size={14} className="text-slate-400" />}
      </div>

      {/* Content */}
      <div className="card p-3.5 ml-1">
        <button
          className="w-full flex items-center justify-between text-left"
          onClick={() => setExpanded((v) => !v)}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-medium text-slate-900">
              {log.step_name || log.stepName || `Step ${index + 1}`}
            </span>
            <span className={STATUS_CLASSES[status] || "badge bg-slate-100 text-slate-600"}>
              {status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            {log.executed_at && (
              <span className="text-xs">
                {new Date(log.executed_at).toLocaleTimeString()}
              </span>
            )}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                {log.result && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">Result</p>
                    <pre className="text-xs bg-slate-50 p-2.5 rounded-lg overflow-auto text-slate-700 font-mono">
                      {typeof log.result === "object"
                        ? JSON.stringify(log.result, null, 2)
                        : log.result}
                    </pre>
                  </div>
                )}
                {log.error && (
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-1">Error</p>
                    <p className="text-xs bg-red-50 p-2.5 rounded-lg text-red-700 font-mono">
                      {log.error}
                    </p>
                  </div>
                )}
                {!log.result && !log.error && (
                  <p className="text-xs text-slate-400 italic">No additional details</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function ExecutionPage() {
  const { id } = useParams();
  const [inputJson, setInputJson] = useState(
    JSON.stringify({ amount: 1500, email: "test@example.com", department: "finance" }, null, 2)
  );
  const [jsonError, setJsonError] = useState("");
  const [running, setRunning] = useState(false);
  const [execution, setExecution] = useState(null);
  const [polling, setPolling] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);

  const validateJson = (val) => {
    try {
      JSON.parse(val);
      setJsonError("");
      return true;
    } catch {
      setJsonError("Invalid JSON");
      return false;
    }
  };

  const handleExecute = async (e) => {
    e.preventDefault();
    if (!validateJson(inputJson)) return;
    setRunning(true);
    setExecution(null);
    try {
      const payload = JSON.parse(inputJson);
      const res = await executeWorkflow(id, { data: payload });
      const execData = res.data;
      setExecution(execData);
      toast.success("Workflow executed!");

      // Find execution ID to poll logs
      const execId = execData.executionId || execData.id || execData.execution?.id;
      if (execId) {
        setPolling(true);
        const poll = setInterval(async () => {
          try {
            const logRes = await getExecution(execId);
            setExecution(logRes.data);
            const logs = logRes.data?.logs || logRes.data?.steps || [];
            const runningStep = logs.find(
              (l) => l.status?.toLowerCase() === "running"
            );
            setCurrentStep(runningStep?.id || null);
            if (
              logRes.data?.status === "completed" ||
              logRes.data?.status === "failed"
            ) {
              clearInterval(poll);
              setPolling(false);
            }
          } catch {
            clearInterval(poll);
            setPolling(false);
          }
        }, 2000);
      }
    } catch (err) {
      setExecution({ status: "failed", error: err?.response?.data?.message || "Execution failed" });
      toast.error(err?.response?.data?.message || "Execution failed");
    } finally {
      setRunning(false);
    }
  };

  const execStatus = execution?.status?.toLowerCase();
  const logs =
    execution?.logs ||
    execution?.steps ||
    execution?.executionLogs ||
    [];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-brand-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Execute Workflow #{id}
            </h2>
            <p className="text-xs text-slate-500">Provide input data to run this workflow</p>
          </div>
        </div>

        <form onSubmit={handleExecute} className="space-y-4">
          <div>
            <label className="label flex items-center gap-1.5">
              Input Data
              <span className="text-slate-400 font-normal">(JSON)</span>
            </label>
            <textarea
              className={`input-field font-mono text-xs h-40 resize-none ${
                jsonError ? "border-red-400 focus:ring-red-400" : ""
              }`}
              value={inputJson}
              onChange={(e) => {
                setInputJson(e.target.value);
                if (e.target.value) validateJson(e.target.value);
              }}
            />
            {jsonError && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={11} />
                {jsonError}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={running || !!jsonError}
            className="btn-primary w-full justify-center py-2.5"
          >
            {running ? <InlineLoader /> : <Play size={16} />}
            {running ? "Executing…" : "Execute Workflow"}
          </motion.button>
        </form>
      </motion.div>

      {/* Execution Result */}
      <AnimatePresence>
        {execution && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Status Banner */}
            <div
              className={`card p-4 flex items-center gap-3 ${
                execStatus === "completed"
                  ? "border-emerald-200 bg-emerald-50/50"
                  : execStatus === "failed"
                  ? "border-red-200 bg-red-50/50"
                  : "border-blue-200 bg-blue-50/50"
              }`}
            >
              {STATUS_ICONS[execStatus] || <Clock size={18} className="text-slate-400" />}
              <div className="flex-1">
                <span className="text-sm font-semibold text-slate-900 capitalize">
                  {execStatus || "Processing…"}
                </span>
                {execution.executionId && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Execution ID: <span className="font-mono">{execution.executionId || execution.id}</span>
                  </p>
                )}
              </div>
              {execution.alert && (
                <span className="text-xs text-slate-600 italic">{execution.alert}</span>
              )}
              {polling && (
                <div className="flex items-center gap-1.5 text-blue-600 text-xs font-medium">
                  <RefreshCw size={12} className="animate-spin" />
                  Live
                </div>
              )}
            </div>

            {/* Step Timeline */}
            {logs.length > 0 && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-5 flex items-center gap-2">
                  Execution Timeline
                  <span className="badge bg-slate-100 text-slate-600">{logs.length} steps</span>
                </h3>
                <div>
                  {logs.map((log, i) => (
                    <StepLog
                      key={log.id || i}
                      log={log}
                      index={i}
                      isActive={log.id === currentStep}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Raw Result if no logs */}
            {logs.length === 0 && execution.result && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Result</h3>
                <pre className="text-xs bg-slate-50 p-3 rounded-lg overflow-auto font-mono text-slate-700">
                  {typeof execution.result === "object"
                    ? JSON.stringify(execution.result, null, 2)
                    : execution.result}
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}