import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Workflow,
  Zap,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";

const navItems = [
  {
    label: "Workflows",
    to: "/",
    icon: LayoutDashboard,
    exact: true,
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-white border-r border-slate-200 flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="text-base font-bold text-slate-900 tracking-tight">
          FlowEngine
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Main
        </p>

        {navItems.map(({ label, to, icon: Icon, exact }) => {
          const active = exact
            ? location.pathname === to
            : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    className={
                      isActive ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"
                    }
                  />
                  <span className="flex-1">{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="w-1.5 h-1.5 bg-brand-600 rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        <div className="pt-3">
          <p className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Quick Actions
          </p>
          <NavLink
            to="/workflow/new"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-150 group"
          >
            <Workflow size={16} className="text-slate-400 group-hover:text-slate-600" />
            <span className="flex-1">New Workflow</span>
            <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2">
          <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
            <span className="text-xs font-bold text-brand-700">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">Admin User</p>
            <p className="text-[10px] text-slate-400 truncate">admin@flowengine.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
