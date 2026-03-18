import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trash2, GitBranch } from "lucide-react";

function EmptyRules() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-10 text-center"
    >
      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
        <GitBranch size={18} className="text-slate-400" />
      </div>
      <p className="text-xs font-medium text-slate-600">No rules defined</p>
      <p className="text-xs text-slate-400 mt-0.5">Add a rule to control step transitions</p>
    </motion.div>
  );
}

export default function RuleTable({ rules, onDelete }) {
  if (!rules || rules.length === 0) return <EmptyRules />;

  const sorted = [...rules].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

  return (
    <div className="overflow-hidden rounded-lg border border-slate-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="th">Priority</th>
            <th className="th">Condition</th>
            <th className="th">Next Step</th>
            {onDelete && <th className="th text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          <AnimatePresence>
            {sorted.map((r, i) => (
              <motion.tr
                key={r.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ delay: i * 0.04 }}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="td">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold">
                    {r.priority ?? i + 1}
                  </span>
                </td>
                <td className="td">
                  <code className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                    {r.condition || "—"}
                  </code>
                </td>
                <td className="td">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <ArrowRight size={12} className="text-slate-400" />
                    <span className="text-xs font-medium">Step #{r.next_step_id ?? "—"}</span>
                  </div>
                </td>
                {onDelete && (
                  <td className="td text-right">
                    <button
                      onClick={() => onDelete(r.id)}
                      className="btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                )}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
