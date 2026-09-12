import React from "react";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const s = status.toLowerCase();

  if (s === "true" || s === "active" || s === "approved") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${className}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>{s === "true" ? "✅ TRUE" : s === "active" ? "Active" : "Approved"}</span>
      </span>
    );
  }

  if (s === "false" || s === "rejected" || s === "cancelled") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 ${className}`}
      >
        <XCircle className="w-3.5 h-3.5 text-rose-400" />
        <span>{s === "false" ? "❌ FALSE" : s === "rejected" ? "Rejected" : "Cancelled"}</span>
      </span>
    );
  }

  if (s === "pending" || s === "pending_verification") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse ${className}`}
      >
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span>Pending</span>
      </span>
    );
  }

  if (s === "expired") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 ${className}`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
        <span>Expired</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700 ${className}`}
    >
      <span>No Plan</span>
    </span>
  );
};
