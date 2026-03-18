import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Play, Workflow, ArrowUpRight } from "lucide-react";

function StatusBadge({ isActive }) {
  return isActive ? (
    <span className="badge-active">
      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5" />
      Active
    </span>
  ) : (
    <span className="badge-inactive">
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-1.5" />
      Inactive
    </span>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Workflow size={24} className="text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-700 mb-1">No workflows yet</h3>
      <p className="text-xs text-slate-500 max-w-xs">
        Create your first workflow to start automating repetitive processes.
      </p>
    </motion.div>
  );
}

export default function WorkflowTable({ workflows }) {
  if (!workflows || workflows.length === 0) return <EmptyState />;

  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="th">Name</th>
            <th className="th">Version</th>
            <th className="th">Status</th>
            <th className="th">Created</th>
            <th className="th text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          <AnimatePresence>
            {workflows.map((w, i) => (
              <motion.tr
                key={w.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                className="hover:bg-slate-50/70 transition-colors duration-100"
              >
                <td className="td">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-brand-50 rounded-md flex items-center justify-center flex-shrink-0">
                      <Workflow size={14} className="text-brand-600" />
                    </div>
                    <span className="font-medium text-slate-900">{w.name}</span>
                  </div>
                </td>
                <td className="td">
                  <span className="badge bg-slate-100 text-slate-600">v{w.version ?? 1}</span>
                </td>
                <td className="td">
                  <StatusBadge isActive={w.is_active} />
                </td>
                <td className="td text-slate-400 text-xs">
                  {w.createdAt
                    ? new Date(w.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td className="td">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/workflow/${w.id}`}
                      className="btn-ghost text-xs gap-1.5"
                    >
                      <Edit2 size={13} />
                      Edit
                    </Link>
                    <Link
                      to={`/execute/${w.id}`}
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      <Play size={12} />
                      Execute
                    </Link>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}