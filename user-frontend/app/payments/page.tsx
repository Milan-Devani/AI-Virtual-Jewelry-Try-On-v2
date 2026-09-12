"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "../../components/layout/Header";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  getPlansApi,
  getUpiDetailsApi,
  submitVerificationApi,
  getMyVerificationsApi,
  getAuthToken,
} from "../../services/api";
import { toast } from "sonner";
import {
  QrCode,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Loader2,
  FileText,
} from "lucide-react";

function PaymentsContent() {
  const searchParams = useSearchParams();
  const initialPlanId = searchParams.get("plan") || "plan-professional";

  const [plans, setPlans] = React.useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = React.useState(initialPlanId);
  const [upiDetails, setUpiDetails] = React.useState<any>(null);
  const [utrNumber, setUtrNumber] = React.useState("");
  const [screenshotFile, setScreenshotFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [verifications, setVerifications] = React.useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = React.useState(true);

  // Load plans & user's past verifications
  React.useEffect(() => {
    getPlansApi()
      .then((data) => {
        setPlans(data);
        if (data.length > 0 && !data.some((p: any) => p.id === selectedPlanId)) {
          setSelectedPlanId(data[0].id);
        }
      })
      .catch(() => {});

    if (getAuthToken()) {
      getMyVerificationsApi()
        .then((data) => setVerifications(data))
        .catch(() => {})
        .finally(() => setLoadingHistory(false));
    } else {
      setLoadingHistory(false);
    }
  }, []);

  // Fetch UPI details when selected plan changes
  React.useEffect(() => {
    if (!selectedPlanId) return;
    getUpiDetailsApi(selectedPlanId)
      .then((data) => setUpiDetails(data))
      .catch((err) => toast.error(err.message || "Failed to load UPI details"));
  }, [selectedPlanId]);

  const handleCopyUpi = () => {
    if (upiDetails?.upiId) {
      navigator.clipboard.writeText(upiDetails.upiId);
      toast.success("UPI ID copied to clipboard: " + upiDetails.upiId);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (PNG, JPG, WebP).");
        return;
      }
      setScreenshotFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!getAuthToken()) {
      toast.error("Please sign in or create an account first to submit payment verification.");
      return;
    }

    if (!utrNumber.trim()) {
      toast.error("Please enter the 12-digit UPI UTR / Bank Reference Number.");
      return;
    }

    if (!screenshotFile) {
      toast.error("Please upload a screenshot of your successful UPI payment.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("planId", selectedPlanId);
      formData.append("utrNumber", utrNumber.trim());
      formData.append("amount", String(upiDetails?.amount || 1999));
      formData.append("screenshot", screenshotFile);

      await submitVerificationApi(formData);
      toast.success("Payment verification submitted successfully! Admin will verify in ~15 mins.");

      setUtrNumber("");
      setScreenshotFile(null);
      setPreviewUrl(null);

      // Refresh verifications
      const updated = await getMyVerificationsApi();
      setVerifications(updated);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || {
    name: "Professional Plan",
    price: 1999,
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A1715] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EFE7] border border-[#E8DFC9] text-xs font-semibold text-[#8C6428] mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D8B77E]" />
            <span>Secure Manual UPI Payment Verification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1715]">
            UPI Payment & Verification
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6B645D]">
            Scan the QR code, complete the transfer, and submit your UTR number to activate your AI generation credits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: QR Code & Bank Transfer Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-[#E2DBD1] shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A736B] mb-2">
                Select Membership Plan
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E2DBD1] bg-[#FBF9F5] text-sm font-semibold text-[#1A1715] focus:outline-none focus:ring-2 focus:ring-[#D8B77E]"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₹{p.price.toLocaleString("en-IN")} / month ({p.generationLimit} credits)
                  </option>
                ))}
              </select>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-6 bg-[#FCFBF8] rounded-xl border border-[#E8DFC9] text-center">
              <div className="relative p-3 bg-white rounded-xl shadow-sm border border-[#E2DBD1] mb-4">
                {/* Visual QR presentation with UPI branding */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 bg-[#1A1715] rounded-lg flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2A2622] to-[#0A0908] opacity-90" />
                  <div className="relative z-10 flex flex-col items-center">
                    <QrCode className="w-24 h-24 text-[#D8B77E] mb-2" />
                    <span className="font-serif font-bold text-sm tracking-wider text-[#FBF9F5]">JEWELAI</span>
                    <span className="text-[10px] text-[#A89F95] mt-0.5">Scan to pay ₹{selectedPlan.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#E2DBD1] text-xs font-mono text-[#2A2622]">
                <span>UPI ID:</span>
                <span className="font-bold text-[#8C6428]">{upiDetails?.upiId || "jewelai@upi"}</span>
                <button
                  onClick={handleCopyUpi}
                  className="p-1 text-[#7A736B] hover:text-[#1A1715] transition-colors"
                  title="Copy UPI ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-[#8C827A] mt-3">
                Accepted apps: Google Pay, PhonePe, Paytm, BHIM, CRED
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-2 pt-2 border-t border-[#EBE5DC]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A534B]">How it works:</h4>
              <ol className="text-xs text-[#6B645D] space-y-1.5 list-decimal pl-4">
                <li>Scan the QR code or send payment to the UPI ID.</li>
                <li>Ensure exact amount: <strong>₹{selectedPlan.price}</strong>.</li>
                <li>Copy the 12-digit UTR reference number from the receipt.</li>
                <li>Upload screenshot & submit below for instant verification.</li>
              </ol>
            </div>
          </div>

          {/* Right Column: Verification Form & Verification History (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Submission Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2DBD1] shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#1A1715] mb-1">
                Submit Payment Verification
              </h3>
              <p className="text-xs text-[#7A736B] mb-6">
                Enter your transaction reference number and upload the screenshot proof.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5A534B] mb-1.5">
                    12-Digit UPI UTR / Bank Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 423985710294"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DBD1] text-sm text-[#1A1715] placeholder:text-[#A89F95] font-mono focus:outline-none focus:ring-2 focus:ring-[#D8B77E]"
                  />
                  <p className="text-[11px] text-[#8C827A] mt-1">
                    Found in your UPI app transaction details page as UTR / Ref No.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5A534B] mb-1.5">
                    Payment Screenshot Receipt *
                  </label>
                  <div className="border-2 border-dashed border-[#E2DBD1] hover:border-[#D8B77E] rounded-xl p-5 text-center cursor-pointer transition-colors bg-[#FCFBF8]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <label htmlFor="screenshot-upload" className="cursor-pointer block">
                      {previewUrl ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={previewUrl}
                            alt="Screenshot preview"
                            className="max-h-40 rounded-lg object-contain shadow-sm mb-2"
                          />
                          <span className="text-xs text-[#8C6428] font-medium hover:underline">
                            Click to change screenshot
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-[#8C827A] mb-2" />
                          <span className="text-xs font-semibold text-[#1A1715]">
                            Click to upload payment screenshot
                          </span>
                          <span className="text-[11px] text-[#8C827A] mt-0.5">
                            PNG, JPG, WebP up to 5MB
                          </span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#1A1715] hover:bg-[#2A2622] text-[#FBF9F5] font-semibold text-sm flex items-center justify-center gap-2 rounded-xl transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying & Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#D8B77E]" />
                      <span>Submit Verification (₹{selectedPlan.price})</span>
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* My Verifications History Tracker */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2DBD1] shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#1A1715] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#8C6428]" />
                <span>Your Verification Status</span>
              </h3>

              {loadingHistory ? (
                <div className="text-center py-6 text-xs text-[#7A736B]">Loading submissions...</div>
              ) : verifications.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#7A736B] bg-[#FCFBF8] rounded-xl border border-[#EBE5DC]">
                  No verification requests submitted yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EBE5DC] text-[#7A736B] font-semibold uppercase tracking-wider">
                        <th className="pb-3">Plan</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">UTR Reference</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE5DC]">
                      {verifications.map((v) => (
                        <tr key={v.id} className="text-[#2A2622]">
                          <td className="py-3 font-semibold">{v.plan?.name || "Membership"}</td>
                          <td className="py-3 font-mono font-bold">₹{v.amount}</td>
                          <td className="py-3 font-mono text-[#6B645D]">{v.utrNumber}</td>
                          <td className="py-3">
                            {v.status === "approved" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                                <CheckCircle2 className="w-3 h-3" /> Approved
                              </span>
                            ) : v.status === "rejected" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]">
                                <XCircle className="w-3 h-3" /> Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                                <Clock className="w-3 h-3 animate-pulse" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-[#7A736B]">
                            {new Date(v.createdAt).toLocaleDateString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center text-xs text-[#8C827A]">Loading UPI Payments...</div>}>
      <PaymentsContent />
    </React.Suspense>
  );
}
