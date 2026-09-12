import React, { useEffect, useState } from "react";
import { AdminHeader } from "../components/layout/AdminHeader";
import { getDashboardStatsApi } from "../services/api";
import { BarChart3, Sparkles, Layers, Cpu } from "lucide-react";

export const Usage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStatsApi()
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminHeader
        title="AI Engine Usage & Generation Telemetry"
        subtitle="Analyze platform-wide Google Gemini try-on volumes, categories, and inference statistics."
      />

      <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Model Spec Card */}
        <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-100">
                Active Vision Model: Gemini 2.5 Flash
              </h3>
              <p className="text-xs text-slate-400">
                Direct anatomical anchoring with category placement and zero identity drift.
              </p>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-xs font-bold text-emerald-400 block">System Operational</span>
            <span className="text-[11px] text-slate-500">Latency: ~3.2s / try-on</span>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800">
          <h3 className="font-serif text-base font-bold text-slate-100 mb-4">
            All Jewelry Categories Usage Distribution
          </h3>
          {!stats?.categoryBreakdown?.length ? (
            <p className="text-xs text-slate-500 italic py-6 text-center">No usage data recorded yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.categoryBreakdown.map((cat: any) => (
                <div key={cat.category} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-300 block mb-1">
                    {cat.category}
                  </span>
                  <span className="font-mono text-2xl font-bold text-amber-400">{cat.count}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">generations</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
