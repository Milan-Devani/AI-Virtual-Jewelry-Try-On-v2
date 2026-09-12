import React, { useEffect, useState } from "react";
import { AdminHeader } from "../components/layout/AdminHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { getAllPaymentsApi } from "../services/api";
import { PaymentVerification } from "../types";
import { CreditCard, Download, Filter } from "lucide-react";

export const Payments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    getAllPaymentsApi(filter === "all" ? undefined : filter)
      .then((data) => setPayments(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <AdminHeader
        title="Complete Payment & Transaction History"
        subtitle="Complete record of all approved, pending, and rejected UPI payments."
      />

      <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Filters */}
        <div className="flex items-center gap-2">
          {["all", "approved", "pending", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-amber-500 text-slate-950"
                  : "bg-[#0F172A] text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Payments Table */}
        <div className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Plan</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">UTR Reference</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Notes</th>
                  <th className="py-4 px-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      Loading payments...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No payment transactions found.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-200 block">{p.user?.name || "User"}</span>
                        <span className="font-mono text-slate-400 text-[11px]">{p.user?.email}</span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-300">{p.plan?.name}</td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-100">₹{p.amount}</td>
                      <td className="py-4 px-6 font-mono text-amber-400/90">{p.utrNumber}</td>
                      <td className="py-4 px-6">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="py-4 px-6 text-slate-400 max-w-[200px] truncate">
                        {p.adminNotes || "—"}
                      </td>
                      <td className="py-4 px-6 text-right text-slate-400 font-mono">
                        {new Date(p.createdAt).toLocaleDateString("en-IN")}
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
