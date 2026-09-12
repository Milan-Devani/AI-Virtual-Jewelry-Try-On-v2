import React, { useEffect, useState } from "react";
import { AdminHeader } from "../components/layout/AdminHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  getUsersApi,
  getUserDetailApi,
  grantMembershipApi,
  revokeMembershipApi,
  getAdminPlansApi,
} from "../services/api";
import { AdminUser, MembershipPlan } from "../types";
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Eye,
  ShieldAlert,
  Sparkles,
  X,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export const Users: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // User detail modal state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any | null>(null);
  const [grantPlanId, setGrantPlanId] = useState("");
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsersApi({ search, filter, page, limit: 15 });
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalUsers(data.total);
    } catch (err: any) {
      toast.error(err.message || "Failed to load users list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, filter, page]);

  useEffect(() => {
    getAdminPlansApi()
      .then((data) => {
        setPlans(data);
        if (data.length > 0) setGrantPlanId(data[0].id);
      })
      .catch(() => {});
  }, []);

  const handleOpenUser = async (userId: string) => {
    setSelectedUserId(userId);
    setSelectedUserDetails(null);
    try {
      const details = await getUserDetailApi(userId);
      setSelectedUserDetails(details);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch user details");
    }
  };

  const handleGrantMembership = async () => {
    if (!selectedUserId || !grantPlanId) return;
    try {
      setIsProcessingAction(true);
      await grantMembershipApi(selectedUserId, grantPlanId, 30);
      toast.success("Membership successfully granted to user!");
      await handleOpenUser(selectedUserId);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to grant membership");
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleRevokeMembership = async () => {
    if (!selectedUserId) return;
    try {
      setIsProcessingAction(true);
      await revokeMembershipApi(selectedUserId, "Revoked via admin dashboard");
      toast.success("Active membership revoked");
      await handleOpenUser(selectedUserId);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke membership");
    } finally {
      setIsProcessingAction(false);
    }
  };

  const filterTabs = [
    { id: "all", label: "All Users" },
    { id: "active", label: "Active Plan" },
    { id: "pending", label: "Pending Verification" },
    { id: "none", label: "No Plan" },
    { id: "expired", label: "Expired" },
  ];

  return (
    <div>
      <AdminHeader
        title="User & Membership Management"
        subtitle={`Inspect user accounts, verify active plan indicators, and grant or revoke access (${totalUsers} total).`}
      />

      <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Controls Bar: Search & Status Filter */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0F172A] border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-[#0F172A] rounded-xl border border-slate-800">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === tab.id
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">User Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Plan</th>
                  {/* CRITICAL EXPLICIT REQUIREMENT: Active Plan? (✅ TRUE / ❌ FALSE) */}
                  <th className="py-4 px-6 text-center">Active Plan?</th>
                  <th className="py-4 px-6">Usage</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No users match the search criteria.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-200">{u.name}</td>
                      <td className="py-4 px-6 font-mono text-slate-400">{u.email}</td>
                      <td className="py-4 px-6">
                        <StatusBadge status={u.status} />
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-300">
                        {u.planName !== "None" ? (
                          <span className="font-semibold text-amber-400">{u.planName}</span>
                        ) : (
                          <span className="text-slate-500">None</span>
                        )}
                      </td>
                      {/* Active Plan? (✅ TRUE / ❌ FALSE) */}
                      <td className="py-4 px-6 text-center">
                        <StatusBadge status={u.activePlanLabel} />
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-400">
                        {u.totalGenerations} try-ons
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleOpenUser(u.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border border-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg bg-slate-800 disabled:opacity-40 hover:bg-slate-700 text-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-lg bg-slate-800 disabled:opacity-40 hover:bg-slate-700 text-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* User Detail & Membership Action Modal */}
      {selectedUserId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-100">
                  {selectedUserDetails?.name || "User Details"}
                </h3>
                <p className="text-xs font-mono text-slate-400">{selectedUserDetails?.email}</p>
              </div>
              <button
                onClick={() => setSelectedUserId(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedUserDetails ? (
              <div className="space-y-6">
                {/* Active Subscription Status Banner */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Subscription State
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-100">
                        {selectedUserDetails.subscriptions?.[0]?.plan?.name || "No Plan Active"}
                      </span>
                      <StatusBadge
                        status={selectedUserDetails.subscriptions?.[0]?.status || "inactive"}
                      />
                    </div>
                  </div>

                  {selectedUserDetails.subscriptions?.[0]?.status === "active" && (
                    <button
                      disabled={isProcessingAction}
                      onClick={handleRevokeMembership}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Revoke Membership</span>
                    </button>
                  )}
                </div>

                {/* Grant Membership Tool */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    <span>Grant / Override Membership Tier</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Directly assign an active membership tier to this user without requiring UPI submission.
                  </p>

                  <div className="flex items-center gap-3">
                    <select
                      value={grantPlanId}
                      onChange={(e) => setGrantPlanId(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — ₹{p.price} ({p.generationLimit} credits)
                        </option>
                      ))}
                    </select>

                    <button
                      disabled={isProcessingAction}
                      onClick={handleGrantMembership}
                      className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {isProcessingAction ? "Granting..." : "Grant 30 Days"}
                    </button>
                  </div>
                </div>

                {/* Recent Try-Ons List */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Recent AI Try-On Generations ({selectedUserDetails.generationUsages?.length ?? 0})
                  </h4>
                  {!selectedUserDetails.generationUsages?.length ? (
                    <p className="text-xs text-slate-500 italic">No try-ons generated yet.</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2.5 max-h-48 overflow-y-auto">
                      {selectedUserDetails.generationUsages.map((usage: any) => (
                        <div
                          key={usage.id}
                          className="rounded-lg overflow-hidden border border-slate-800 aspect-[4/5] relative bg-slate-900"
                        >
                          <img
                            src={usage.outputImageUrl || usage.inputJewelryUrl}
                            alt={usage.category}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1 text-[9px] text-white truncate">
                            {usage.category}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">Loading user profile...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
