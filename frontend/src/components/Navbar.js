import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Bell } from "lucide-react";

const pageTitles = {
  "/": { title: "Workflows", subtitle: "Manage and run your automation workflows" },
};

function getTitle(pathname) {
  if (pathname === "/") return pageTitles["/"];
  if (pathname.startsWith("/workflow/")) {
    return {
      title: "Workflow Editor",
      subtitle: "Configure steps and transition rules",
    };
  }
  if (pathname.startsWith("/execute/")) {
    return {
      title: "Execute Workflow",
      subtitle: "Run a workflow and monitor execution",
    };
  }
  if (pathname.startsWith("/rules/")) {
    return {
      title: "Rule Editor",
      subtitle: "Define transition conditions and priorities",
    };
  }
  return { title: "FlowEngine", subtitle: "" };
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, subtitle } = getTitle(location.pathname);
  const canGoBack = location.pathname !== "/";

  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-6 z-30">
      <div className="flex items-center gap-3 flex-1">
        {canGoBack && (
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost p-1.5 -ml-1.5"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <div>
          <h1 className="text-base font-semibold text-slate-900 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 leading-tight">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn-ghost p-2 relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
