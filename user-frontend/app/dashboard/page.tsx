"use client";

import * as React from "react";
import Link from "next/link";
import { Header } from "../../components/layout/Header";
import { Button } from "../../components/ui/button";
import {
  getMeApi,
  getLocalHistory,
  getCachedUser,
  getCachedMembership,
  getAuthToken,
  normalizeMediaUrl,
  AUTH_CHANGE_EVENT,
} from "../../services/api";
import {
  Sparkles,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Wand2,
  Calendar,
  Layers,
  History,
} from "lucide-react";

export default function DashboardPage() {
  const [profileData, setProfileData] = React.useState<any>(null);
  const [localGenerations, setLocalGenerations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchUserData = React.useCallback(() => {
    setLocalGenerations(getLocalHistory());
    getMeApi()
      .then((data) => {
        if (data) setProfileData(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    // Synchronously hydrate from cache on mount (0ms)
    if (getAuthToken()) {
      const cachedUser = getCachedUser();
      const cachedMem = getCachedMembership();
      if (cachedUser) {
        setProfileData({
          user: cachedUser,
          membership: cachedMem,
          subscription: cachedUser.activeSubscription || null,
        });
        setLoading(false);
      }
    }
    fetchUserData();
  }, [fetchUserData]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const handleAuth = () => {
      fetchUserData();
    };
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuth);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuth);
  }, [fetchUserData]);

  const membership = profileData?.membership;
  const isActivePlan = membership?.isActive ?? false;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A1715] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#EBE5DC]">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1A1715]">
              Welcome, {profileData?.user?.name || "Jeweler"}
            </h1>
            <p className="text-xs sm:text-sm text-[#7A736B] mt-1">
              Manage your AI Virtual Jewelry Studio membership, credits, and generated campaigns.
            </p>
          </div>

          <Link href="/">
            <Button className="bg-[#1A1715] hover:bg-[#2A2622] text-[#FBF9F5] flex items-center gap-2 font-semibold text-xs py-2.5 px-5 rounded-xl shadow-sm">
              <Wand2 className="w-4 h-4 text-[#D8B77E]" />
              <span>Launch Try-On Studio</span>
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Active Plan Indicator */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2DBD1] shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A736B]">
              Active Plan?
            </span>
            <div className="mt-3 flex items-center gap-2">
              {isActivePlan ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                  <CheckCircle2 className="w-4 h-4" /> ✅ TRUE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]">
                  <XCircle className="w-4 h-4" /> ❌ FALSE
                </span>
              )}
            </div>
            <span className="text-xs text-[#8C827A] mt-2">
              {membership?.plan?.name ? `${membership.plan.name} Tier` : "No Active Tier"}
            </span>
          </div>

          {/* Remaining Credits */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2DBD1] shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A736B]">
              Try-On Credits
            </span>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-serif text-3xl font-extrabold text-[#1A1715]">
                {membership?.remainingCredits || 0}
              </span>
              <span className="text-xs text-[#7A736B]">/ {membership?.totalCredits || 0}</span>
            </div>
            <span className="text-xs text-[#8C827A] mt-2">
              {membership?.usedCredits || 0} try-ons generated
            </span>
          </div>

          {/* Plan Expiry */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2DBD1] shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A736B]">
              Billing Cycle
            </span>
            <div className="mt-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8C6428]" />
              <span className="text-sm font-bold text-[#1A1715]">
                {profileData?.subscription?.currentPeriodEnd
                  ? new Date(profileData.subscription.currentPeriodEnd).toLocaleDateString("en-IN")
                  : "N/A"}
              </span>
            </div>
            <Link href="/pricing" className="text-xs text-[#8C6428] font-semibold hover:underline mt-2">
              Upgrade or Renew →
            </Link>
          </div>

          {/* Quick Payment Action */}
          <div className="bg-gradient-to-br from-[#FCFBF8] to-[#F4EFE7] rounded-2xl p-6 border border-[#E8DFC9] shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C6428]">
              UPI Quick Pay
            </span>
            <p className="text-xs text-[#6B645D] mt-2">
              Submit transaction proof for instant credit top-up.
            </p>
            <Link href="/payments" className="mt-3">
              <Button size="sm" variant="outline" className="w-full text-xs border-[#D8B77E] text-[#8C6428]">
                Submit UTR Proof →
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Generated Images Gallery */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2DBD1] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#8C6428]" />
              <h2 className="font-serif text-xl font-bold text-[#1A1715]">
                Recent Virtual Try-On Creations
              </h2>
            </div>
            <Link href="/" className="text-xs font-semibold text-[#8C6428] hover:underline flex items-center gap-1">
              Open Studio <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {localGenerations.length === 0 ? (
            <div className="text-center py-12 bg-[#FCFBF8] rounded-xl border border-[#EBE5DC]">
              <Sparkles className="w-8 h-8 text-[#D8B77E] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#1A1715]">No try-ons generated yet</p>
              <p className="text-xs text-[#7A736B] mt-1 mb-4">
                Upload a jewelry piece and model to create your first virtual try-on campaign.
              </p>
              <Link href="/">
                <Button size="sm" className="bg-[#1A1715] text-[#FBF9F5] text-xs">
                  Generate Now
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {localGenerations.slice(0, 12).map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl overflow-hidden border border-[#E2DBD1] bg-[#FCFBF8] aspect-[4/5]"
                >
                  <img
                    src={normalizeMediaUrl(item.generatedImageUrl || item.jewelryImageUrl)}
                    alt={item.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end text-white text-[11px]">
                    <span className="font-bold truncate">{item.category}</span>
                    <span className="text-[10px] text-gray-300">
                      {new Date(item.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
