import React, { useEffect, useState } from "react";
import { AdminHeader } from "../components/layout/AdminHeader";
import {
  getAdminPlansApi,
  createPlanApi,
  updatePlanApi,
  deletePlanApi,
} from "../services/api";
import { MembershipPlan } from "../types";
import { Plus, Edit2, Trash2, Check, X, Layers, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Plans: React.FC = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Create modal state
  const [editingPlan, setEditingPlan] = useState<Partial<MembershipPlan> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await getAdminPlansApi();
      setPlans(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      if (isCreating) {
        await createPlanApi(editingPlan);
        toast.success("New membership plan created!");
      } else if (editingPlan.id) {
        await updatePlanApi(editingPlan.id, editingPlan);
        toast.success("Plan updated successfully!");
      }
      setEditingPlan(null);
      fetchPlans();
    } catch (err: any) {
      toast.error(err.message || "Failed to save plan");
    }
  };

  const handleToggleActive = async (plan: MembershipPlan) => {
    try {
      await updatePlanApi(plan.id, { isActive: !plan.isActive });
      toast.success(`Plan ${!plan.isActive ? "activated" : "deactivated"}`);
      fetchPlans();
    } catch (err: any) {
      toast.error(err.message || "Failed to update plan");
    }
  };

  return (
    <div>
      <AdminHeader
        title="Membership Plans Configuration"
        subtitle="Manage SaaS subscription tiers, pricing (INR), generation quotas, and features."
      />

      <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-end">
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingPlan({
                name: "",
                price: 1499,
                generationLimit: 100,
                interval: "monthly",
                features: ["AI Try-On Access", "HD Export"],
                isActive: true,
              });
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`bg-[#0F172A] rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                p.isActive ? "border-slate-800" : "border-slate-800/40 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-xl font-bold text-slate-100">{p.name}</h3>
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.isActive
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {p.isActive ? "ACTIVE" : "INACTIVE"}
                  </button>
                </div>

                <p className="text-xs text-slate-400 mb-4">{p.description || "SaaS Membership Plan"}</p>

                <div className="flex items-baseline gap-1 mb-4 pb-4 border-b border-slate-800">
                  <span className="font-serif text-3xl font-extrabold text-slate-100">
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-slate-400">/{p.interval}</span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl mb-4 text-xs font-semibold text-amber-400">
                  ⚡ {p.generationLimit} AI Virtual Try-Ons / month
                </div>

                <ul className="space-y-1.5 text-xs text-slate-400 mb-6">
                  {Array.isArray(p.features) &&
                    p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPlan(p);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Edit/Create Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-100">
                {isCreating ? "Create Plan" : "Edit Plan"}
              </h3>
              <button
                onClick={() => setEditingPlan(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Plan Name
                </label>
                <input
                  type="text"
                  required
                  value={editingPlan.name || ""}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingPlan.price || 0}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, price: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Credits Limit
                  </label>
                  <input
                    type="number"
                    required
                    value={editingPlan.generationLimit || 0}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        generationLimit: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingPlan.description || ""}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
