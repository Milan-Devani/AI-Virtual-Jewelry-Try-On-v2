import React, { useEffect, useState } from "react";
import { AdminHeader } from "../components/layout/AdminHeader";
import { getAuditLogsApi } from "../services/api";
import { AuditLog } from "../types";
import { ShieldAlert, User, Terminal } from "lucide-react";

export const Audit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogsApi()
      .then((data) => setLogs(data.logs))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminHeader
        title="Administrative Audit Trail"
        subtitle="Tamper-proof chronological log of all administrator actions, overrides, and approvals."
      />

      <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Admin</th>
                  <th className="py-4 px-6">Action</th>
                  <th className="py-4 px-6">Target Resource</th>
                  <th className="py-4 px-6">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-sans">
                      Loading audit trail...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-sans">
                      No administrative actions logged yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-4 px-6 text-slate-400">
                        {new Date(log.createdAt).toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-6 text-slate-200">
                        {log.admin?.email || log.adminId}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {log.targetType} ({log.targetId.slice(0, 8)}...)
                      </td>
                      <td className="py-4 px-6 text-slate-400 max-w-[280px] truncate text-[11px]">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
