import React, { useEffect, useState } from "react";
import { AdminHeader } from "../components/layout/AdminHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  getUsersApi,
  getUserDetailApi,
  grantMembershipApi,
  revokeMembershipApi,
  updateUserApi,
  deleteUserApi,
  getAdminPlansApi,
} from "../services/api";
import { AdminUser, MembershipPlan } from "../types";
import {
  Search,
  UserCheck,
  UserX,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  AlertTriangle,
  Mail,
  Phone,
  User,
  ShieldCheck,
  Crown,
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

  // Edit user state
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    planId: "none",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete user state
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleStartEdit = (u: AdminUser) => {
    const currentPlan = plans.find(
      (p) => p.name.toLowerCase() === (u.planName || "").toLowerCase()
    );
    const names = (u.name || "").split(" ");
    setEditingUser(u);
    setEditFormData({
      firstName: u.firstName || names[0] || "",
      lastName: u.lastName || names.slice(1).join(" ") || "",
      email: u.email || "",
      phoneNumber: u.phoneNumber || "",
      planId: u.hasActivePlan && currentPlan ? currentPlan.id : "none",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editFormData.email.trim()) {
      toast.error("Email address is required");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(editFormData.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsSavingEdit(true);
      await updateUserApi(editingUser.id, {
        firstName: editFormData.firstName.trim(),
        lastName: editFormData.lastName.trim(),
        name: [editFormData.firstName.trim(), editFormData.lastName.trim()].filter(Boolean).join(" "),
        email: editFormData.email.trim().toLowerCase(),
        phoneNumber: editFormData.phoneNumber.trim(),
        planId: editFormData.planId,
      });

      toast.success("User details updated successfully!");
      setEditingUser(null);
      fetchUsers();

      if (selectedUserId === editingUser.id) {
        handleOpenUser(editingUser.id);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleStartDelete = (u: AdminUser) => {
    setDeletingUser(u);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      setIsDeleting(true);
      await deleteUserApi(deletingUser.id);
      toast.success(`User ${deletingUser.name || deletingUser.email} has been deleted`);
      setDeletingUser(null);
      if (selectedUserId === deletingUser.id) {
        setSelectedUserId(null);
        setSelectedUserDetails(null);
      }
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
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
        subtitle={`Inspect customer accounts, modify details, verify active subscriptions, or remove accounts (${totalUsers} total).`}
      />

      <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Controls Bar: Search & Status Filter */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
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
                    <tr key={u.id} className="hover:bg-slate-850/40 transition-colors group">
                      <td className="py-4 px-6 font-semibold text-slate-200">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-xs uppercase">
                            {(u.firstName || u.name || "U")[0]}
                          </div>
                          <div>
                            <div>{u.name}</div>
                            {u.phoneNumber && (
                              <div className="text-[11px] font-normal text-slate-400 font-mono">
                                {u.phoneNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
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
                      <td className="py-4 px-6 text-center">
                        <StatusBadge status={u.activePlanLabel} />
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-400">
                        {u.totalGenerations} try-ons
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* View Details */}
                          <button
                            title="View user details"
                            onClick={() => handleOpenUser(u.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {/* Edit User */}
                          <button
                            title="Edit user details & plan"
                            onClick={() => handleStartEdit(u)}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors border border-amber-500/30"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete User */}
                          <button
                            title="Delete user account"
                            onClick={() => handleStartDelete(u)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors border border-rose-500/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-100">
                    Edit User Profile
                  </h3>
                  <p className="text-xs text-slate-400">
                    Update profile information and assigned tier
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>First Name</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, firstName: e.target.value })
                    }
                    placeholder="First name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Last Name</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, lastName: e.target.value })
                    }
                    placeholder="Last name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={editFormData.phoneNumber}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, phoneNumber: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              {/* Membership Plan Assignment */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Membership Plan Tier</span>
                </label>
                <select
                  value={editFormData.planId}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, planId: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="none">No Active Plan (Revoke/None)</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.price}/mo ({p.generationLimit} Credits)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  Selecting a plan here will immediately grant/override 30 days of active access.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isSavingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-rose-500/30 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-100">
                  Delete User Account?
                </h3>
                <p className="text-xs text-slate-400">
                  This action is permanent and irreversible.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
              <div className="text-slate-300 font-semibold">
                {deletingUser.name || "Customer User"}
              </div>
              <div className="font-mono text-slate-400">{deletingUser.email}</div>
              {deletingUser.phoneNumber && (
                <div className="text-slate-500">{deletingUser.phoneNumber}</div>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Deleting this account will permanently remove this customer, along with their subscriptions, try-on history, and payment submissions from your Supabase database.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? "Deleting..." : "Delete User"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail & Membership Action Modal */}
      {selectedUserId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-100">
                  {selectedUserDetails?.name || "User Details"}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  {selectedUserDetails?.email}
                  {selectedUserDetails?.phoneNumber && ` • ${selectedUserDetails.phoneNumber}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {selectedUserDetails && (
                  <>
                    <button
                      title="Edit this user"
                      onClick={() => {
                        const targetUser = users.find((u) => u.id === selectedUserId) || {
                          id: selectedUserDetails.id,
                          name: selectedUserDetails.name,
                          firstName: selectedUserDetails.firstName,
                          lastName: selectedUserDetails.lastName,
                          email: selectedUserDetails.email,
                          phoneNumber: selectedUserDetails.phoneNumber,
                          role: selectedUserDetails.role,
                          status: selectedUserDetails.subscriptions?.[0]?.status === "active" ? "active" : "no_plan",
                          planName: selectedUserDetails.subscriptions?.[0]?.plan?.name || "None",
                          planPrice: selectedUserDetails.subscriptions?.[0]?.plan?.price || 0,
                          hasActivePlan: selectedUserDetails.subscriptions?.[0]?.status === "active",
                          activePlanLabel: selectedUserDetails.subscriptions?.[0]?.status === "active" ? "TRUE" : "FALSE",
                          generationLimit: selectedUserDetails.subscriptions?.[0]?.plan?.generationLimit || 0,
                          totalGenerations: selectedUserDetails.generationUsages?.length || 0,
                          createdAt: selectedUserDetails.createdAt,
                        };
                        handleStartEdit(targetUser);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      title="Delete this user"
                      onClick={() => {
                        const targetUser = users.find((u) => u.id === selectedUserId) || {
                          id: selectedUserDetails.id,
                          name: selectedUserDetails.name,
                          email: selectedUserDetails.email,
                          phoneNumber: selectedUserDetails.phoneNumber,
                          role: selectedUserDetails.role,
                          status: "no_plan",
                          planName: "None",
                          planPrice: 0,
                          hasActivePlan: false,
                          activePlanLabel: "FALSE",
                          generationLimit: 0,
                          totalGenerations: 0,
                          createdAt: selectedUserDetails.createdAt,
                        };
                        handleStartDelete(targetUser);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedUserId(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
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
