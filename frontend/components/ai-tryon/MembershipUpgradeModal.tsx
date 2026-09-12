"use client";

import * as React from "react";
import { Modal } from "../ui/dialog";
import { Button } from "../ui/button";
import { Sparkles, Check, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface MembershipUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export function MembershipUpgradeModal({
  isOpen,
  onClose,
  reason,
}: MembershipUpgradeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Active Membership Required"
      description={
        reason ||
        "To generate photorealistic AI jewelry try-ons with high product fidelity, please choose a membership plan."
      }
    >
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Starter */}
          <div className="p-3.5 rounded-xl border border-[#E2DBD1] bg-white hover:border-[#D8B77E] transition-all flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6428] bg-[#F4EFE7] px-2 py-0.5 rounded-md">
                Starter
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-bold font-serif text-[#1A1715]">₹999</span>
                <span className="text-xs text-[#7A736B]">/mo</span>
              </div>
              <p className="text-xs text-[#5A534B] mt-1 font-medium">50 AI Try-Ons</p>
            </div>
            <Link href="/payments?plan=plan-starter" onClick={onClose} className="mt-3">
              <Button variant="outline" size="sm" className="w-full text-xs border-[#D8B77E] text-[#8C6428]">
                Select
              </Button>
            </Link>
          </div>

          {/* Professional - Featured */}
          <div className="p-3.5 rounded-xl border-2 border-[#D8B77E] bg-[#FCFBF8] shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-6 top-2.5 bg-[#D8B77E] text-[#1A1715] text-[9px] font-extrabold uppercase tracking-widest px-7 py-0.5 rotate-45 shadow-sm">
              POPULAR
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6428] bg-[#F4EFE7] px-2 py-0.5 rounded-md">
                Professional
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-bold font-serif text-[#1A1715]">₹1,999</span>
                <span className="text-xs text-[#7A736B]">/mo</span>
              </div>
              <p className="text-xs text-[#5A534B] mt-1 font-medium">150 AI Try-Ons</p>
              <ul className="text-[11px] text-[#6B645D] space-y-1 mt-2">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-[#D8B77E] shrink-0" />
                  <span>All 11 Categories</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-[#D8B77E] shrink-0" />
                  <span>11 Regional Attires</span>
                </li>
              </ul>
            </div>
            <Link href="/payments?plan=plan-professional" onClick={onClose} className="mt-3">
              <Button size="sm" className="w-full text-xs bg-[#1A1715] hover:bg-[#2A2622] text-[#FBF9F5]">
                Upgrade Now
              </Button>
            </Link>
          </div>

          {/* Business */}
          <div className="p-3.5 rounded-xl border border-[#E2DBD1] bg-white hover:border-[#D8B77E] transition-all flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6428] bg-[#F4EFE7] px-2 py-0.5 rounded-md">
                Business
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-bold font-serif text-[#1A1715]">₹4,999</span>
                <span className="text-xs text-[#7A736B]">/mo</span>
              </div>
              <p className="text-xs text-[#5A534B] mt-1 font-medium">500 AI Try-Ons</p>
            </div>
            <Link href="/payments?plan=plan-business" onClick={onClose} className="mt-3">
              <Button variant="outline" size="sm" className="w-full text-xs border-[#D8B77E] text-[#8C6428]">
                Select
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#F4EFE7]/70 border border-[#E8DFC9] flex items-center justify-between text-xs text-[#6B645D]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8C6428]" />
            <span>Instant UPI QR payment with quick verification</span>
          </div>
          <Link href="/pricing" onClick={onClose} className="font-semibold text-[#8C6428] hover:underline flex items-center gap-1">
            Compare all plans <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </Modal>
  );
}
