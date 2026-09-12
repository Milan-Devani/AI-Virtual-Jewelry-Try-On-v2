import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminHeader } from "../components/layout/AdminHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { getDashboardStatsApi } from "../services/api";
import { DashboardStats } from "../types";
import {
  Users,
  CreditCard,
  Sparkles,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckSquare,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStatsApi()
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const overview = stats?.overview;

  return (
    <div>
      <AdminHeader
        title="Operations & Analytics Dashboard"
        subtitle="Real-time overview of subscriptions, pending UPI payments, and try-on activity."
      />

      <main className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Active Subscriptions */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Subscribers
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-extrabold text-slate-100">
                {overview?.activeSubscriptions ?? 0}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">Active Plan</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Out of {overview?.totalUsers ?? 0} total registered users
            </span>
          </div>

          {/* Pending Verifications */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-amber-500/30 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Pending Verifications
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Clock className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-extrabold text-amber-400">
                {overview?.pendingVerifications ?? 0}
              </span>
              <span className="text-xs text-amber-400/80 font-medium">Awaiting Review</span>
            </div>
            <Link
              to="/payments/verifications"
              className="text-[11px] text-amber-400 font-semibold hover:underline mt-1 inline-flex items-center gap-1"
            >
              Verify UPI payments now →
            </Link>
          </div>

          {/* Total Revenue */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Revenue (UPI)
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-serif text-3xl font-extrabold text-slate-100">
                ₹{(overview?.totalRevenueINR ?? 0).toLocaleString("en-IN")}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Verified bank receipts</span>
          </div>

          {/* Total Try-Ons */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                AI Try-Ons Generated
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-extrabold text-slate-100">
                {overview?.totalTryOns ?? 0}
              </span>
              <span className="text-xs text-indigo-400 font-semibold">Gemini 2.5 Flash</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">100% fidelity locked</span>
          </div>
        </div>

        {/* Actionable Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Pending Verifications Queue (7 cols) */}
          <div className="lg:col-span-7 bg-[#0F172A] rounded-2xl p-6 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-5 h-5 text-amber-400" />
                <h2 className="font-serif text-lg font-bold text-slate-100">
                  Recent Payment Submissions
                </h2>
              </div>
              <Link
                to="/payments/verifications"
                className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
              >
                View all verifications <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500">Loading payments...</div>
            ) : !stats?.recentVerifications?.length ? (
              <div className="py-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/80">
                No recent payment submissions.
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {stats.recentVerifications.map((v) => (
                  <div key={v.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">
                          {v.user?.name || v.user?.email || "User"}
                        </span>
                        <StatusBadge status={v.status} />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Plan: <strong className="text-slate-300">{v.plan?.name}</strong> • UTR:{" "}
                        <span className="font-mono text-amber-400/90">{v.utrNumber}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-slate-100">
                        ₹{v.amount}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(v.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Distribution / Telemetry (5 cols) */}
          <div className="lg:col-span-5 bg-[#0F172A] rounded-2xl p-6 border border-slate-800 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span>Jewelry Category Popularity</span>
            </h2>

            {!stats?.categoryBreakdown?.length ? (
              <div className="py-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/80">
                No generation telemetry yet.
              </div>
            ) : (
              <div className="space-y-4">
                {stats.categoryBreakdown.map((cat) => {
                  const max = Math.max(...stats.categoryBreakdown.map((c) => c.count), 1);
                  const pct = Math.round((cat.count / max) * 100);
                  return (
                    <div key={cat.category}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-slate-300">{cat.category}</span>
                        <span className="font-mono text-slate-400">{cat.count} try-ons</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
