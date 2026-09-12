import React, { useEffect, useState } from "react";
import { AdminHeader } from "../components/layout/AdminHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  getPendingVerificationsApi,
  approveVerificationApi,
  rejectVerificationApi,
} from "../services/api";
import { PaymentVerification } from "../types";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  X,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileImage,
} from "lucide-react";
import { toast } from "sonner";

export const PaymentVerifications: React.FC = () => {
  const [verifications, setVerifications] = useState<PaymentVerification[]>([]);
  const [loading, setLoading] = useState(true);

  // Screenshot inspection modal
  const [selectedVerification, setSelectedVerification] = useState<PaymentVerification | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const data = await getPendingVerificationsApi();
      setVerifications(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load pending verifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setIsProcessing(true);
      await approveVerificationApi(id, "Payment verified and approved via admin panel");
      toast.success("Payment verified! User's subscription and AI credits are now active.");
      setSelectedVerification(null);
      fetchVerifications();
    } catch (err: any) {
      toast.error(err.message || "Failed to approve verification");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setIsProcessing(true);
      await rejectVerificationApi(id, rejectReason || "UTR number or screenshot could not be verified with bank.");
      toast.success("Payment verification rejected.");
      setSelectedVerification(null);
      setShowRejectInput(false);
      setRejectReason("");
      fetchVerifications();
    } catch (err: any) {
      toast.error(err.message || "Failed to reject verification");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Pending UPI Payment Verifications"
        subtitle="Review uploaded transaction screenshots and UTR numbers to approve active memberships."
      />

      <main className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Verification Queue Table */}
        <div className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-lg font-bold text-slate-100">
                Awaiting Approval ({verifications.length})
              </h2>
            </div>
            <button
              onClick={fetchVerifications}
              className="text-xs text-slate-400 hover:text-slate-200 font-medium"
            >
              Refresh Queue
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Plan</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">UTR / Reference No.</th>
                  <th className="py-4 px-6">Submitted</th>
                  <th className="py-4 px-6 text-center">Screenshot</th>
                  <th className="py-4 px-6 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      Loading verification queue...
                    </td>
                  </tr>
                ) : verifications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-500">
                      <ShieldCheck className="w-10 h-10 text-emerald-500/40 mx-auto mb-2" />
                      <p className="font-semibold text-slate-300">All payments are verified!</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        No pending submissions awaiting review.
                      </p>
                    </td>
                  </tr>
                ) : (
                  verifications.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-200 block">
                          {v.user?.name || "User"}
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">{v.user?.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-amber-400">{v.plan?.name}</span>
                        <span className="text-[10px] text-slate-500 block">
                          {v.plan?.generationLimit} credits
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-100 text-sm">
                        ₹{v.amount}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-300 font-semibold bg-slate-900/30 px-2 rounded">
                        {v.utrNumber}
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        {new Date(v.createdAt).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => {
                            setSelectedVerification(v);
                            setShowRejectInput(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold inline-flex items-center gap-1 border border-slate-700"
                        >
                          <FileImage className="w-3.5 h-3.5 text-amber-400" />
                          <span>View Proof</span>
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleApprove(v.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold inline-flex items-center gap-1 shadow-sm transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVerification(v);
                            setShowRejectInput(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Screenshot Inspection & Action Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-xl max-h-[95vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-100">
                  Inspect Payment Screenshot
                </h3>
                <p className="text-xs text-slate-400">
                  User: {selectedVerification.user?.email} • Plan: {selectedVerification.plan?.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedVerification(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification Metadata Box */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">
                  UTR Reference
                </span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {selectedVerification.utrNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">
                  Amount Transferred
                </span>
                <span className="font-mono font-bold text-slate-100 text-sm">
                  ₹{selectedVerification.amount}
                </span>
              </div>
            </div>

            {/* Screenshot Preview Image */}
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex items-center justify-center min-h-[260px] max-h-[420px]">
              <img
                src={selectedVerification.screenshotUrl}
                alt="Payment proof screenshot"
                className="max-h-[400px] w-auto object-contain rounded-lg"
              />
            </div>

            {/* Reject reason input if triggered */}
            {showRejectInput && (
              <div className="space-y-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <label className="block text-xs font-bold text-rose-300">
                  Reason for rejection:
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR number not found in bank statement"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-rose-500/40 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedVerification(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>

              {showRejectInput ? (
                <button
                  disabled={isProcessing}
                  onClick={() => handleReject(selectedVerification.id)}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  {isProcessing ? "Rejecting..." : "Confirm Rejection"}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowRejectInput(true)}
                    className="px-4 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold"
                  >
                    Reject
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={() => handleApprove(selectedVerification.id)}
                    className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isProcessing ? "Activating..." : "Approve & Activate Plan"}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
