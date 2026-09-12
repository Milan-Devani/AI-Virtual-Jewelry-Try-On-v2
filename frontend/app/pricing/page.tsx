"use client";

import * as React from "react";
import Link from "next/link";
import { Header } from "../../components/layout/Header";
import { Button } from "../../components/ui/button";
import { Sparkles, Check, ArrowRight, ShieldCheck, QrCode, Zap } from "lucide-react";
import { getPlansApi } from "../../services/api";

export default function PricingPage() {
  const [plans, setPlans] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getPlansApi()
      .then((data) => setPlans(data))
      .catch(() => {
        // Fallback static plans
        setPlans([
          {
            id: "plan-starter",
            name: "Starter",
            price: 999,
            generationLimit: 50,
            description: "Ideal for boutique jewelers and emerging designers starting with AI try-on.",
            features: [
              "50 AI Virtual Try-Ons / month",
              "7 Core Jewelry Categories",
              "Custom Model & AI Persona Mode",
              "Standard HD Export",
              "Email Support",
            ],
          },
          {
            id: "plan-professional",
            name: "Professional",
            price: 1999,
            generationLimit: 150,
            description: "Perfect for established luxury retailers, multi-category catalogs, and e-commerce teams.",
            popular: true,
            features: [
              "150 AI Virtual Try-Ons / month",
              "All 11 Jewelry Categories (including Sets & Bridal)",
              "11 Regional Indian Attire Presets",
              "4 Editorial Studio Backgrounds",
              "2K Ultra-HD Crisp Export",
              "Priority Generation Queue",
              "Dedicated Chat & Email Support",
            ],
          },
          {
            id: "plan-business",
            name: "Business",
            price: 4999,
            generationLimit: 500,
            description: "For high-volume jewelry brands, multi-brand marketplaces, and enterprise studios.",
            features: [
              "500 AI Virtual Try-Ons / month",
              "Unlimited Model Personas & Custom Styling",
              "All 11 Categories + Custom Anatomical Anchoring",
              "Full Commercial Usage License",
              "4K Studio Master Export",
              "Dedicated Account Manager & VIP SLA",
            ],
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A1715] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EFE7] border border-[#E8DFC9] text-xs font-semibold text-[#8C6428] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D8B77E]" />
            <span>Transparent SaaS Pricing — Direct UPI Payments</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-[#1A1715]">
            Choose Your AI Jewelry Studio Plan
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6B645D]">
            Unlock photorealistic try-on generations for Indian bridal ensembles, temple jewelry, and contemporary couture with zero identity drift.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isPopular = plan.slug === "professional" || plan.name.toLowerCase().includes("professional") || plan.popular;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isPopular
                    ? "bg-white border-2 border-[#D8B77E] shadow-xl scale-105 z-10"
                    : "bg-[#FCFBF8] border border-[#E2DBD1] hover:border-[#D8B77E]/80 shadow-sm"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D8B77E] text-[#1A1715] text-[10px] font-extrabold tracking-widest uppercase px-4 py-1 rounded-full shadow-md">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-2xl font-bold text-[#1A1715]">{plan.name}</h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#F4EFE7] text-[#8C6428] border border-[#E8DFC9]">
                      {plan.generationLimit} Try-Ons
                    </span>
                  </div>

                  <p className="text-xs text-[#7A736B] leading-relaxed mb-6 min-h-[36px]">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-[#EBE5DC]">
                    <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#1A1715]">
                      ₹{plan.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm font-medium text-[#7A736B]">/month</span>
                  </div>

                  {/* Feature checklist */}
                  <ul className="space-y-3.5 mb-8">
                    {(plan.features as string[]).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-[#4A433D]">
                        <div className="w-5 h-5 rounded-full bg-[#F4EFE7] flex items-center justify-center shrink-0 mt-0.5 text-[#8C6428]">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={`/payments?plan=${plan.id}`} className="w-full mt-4">
                  <Button
                    className={`w-full py-6 font-semibold flex items-center justify-center gap-2 text-sm rounded-xl transition-all ${
                      isPopular
                        ? "bg-[#1A1715] hover:bg-[#2A2622] text-[#FBF9F5] shadow-md"
                        : "bg-white hover:bg-[#F4EFE7] text-[#1A1715] border border-[#D8B77E]"
                    }`}
                  >
                    <span>Subscribe via UPI</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Security & Verification Banner */}
        <div className="mt-16 p-6 rounded-2xl bg-[#F4EFE7]/80 border border-[#E8DFC9] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8DFC9] flex items-center justify-center text-[#8C6428] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#1A1715]">Direct Bank Transfer via UPI</h4>
              <p className="text-xs text-[#6B645D] mt-0.5">
                Scan QR with Google Pay, PhonePe, Paytm or BHIM. Fast manual verification in under 15 minutes.
              </p>
            </div>
          </div>

          <Link href="/payments">
            <Button variant="outline" className="border-[#D8B77E] text-[#8C6428] hover:bg-[#F4EFE7] text-xs font-semibold">
              <QrCode className="w-4 h-4 mr-2" />
              <span>View UPI QR Code & Instructions</span>
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
