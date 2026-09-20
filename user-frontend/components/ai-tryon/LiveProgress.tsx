"use client";

import * as React from "react";
import { Sparkles, Gem, ShieldCheck, Wand2, CheckCircle2, Cpu } from "lucide-react";

const STAGES = [
  { label: "Harmonizing reference images & lighting vectors...", progress: 18, detail: "Detecting ambient light color temperature" },
  { label: "Analyzing model anatomical landmarks & skin tones...", progress: 42, detail: "Locking facial proportions and posture" },
  { label: "Extracting gemstone geometry & specular facets...", progress: 68, detail: "Raytracing metal luster & refractive caustics" },
  { label: "Synthesizing luxury studio depth & reflections...", progress: 85, detail: "Blending contact shadows and natural curvature" },
  { label: "Applying master 2K photorealistic finish...", progress: 96, detail: "Ultra-HD polish and color grading" },
];

const LUXURY_TIPS = [
  "Preserving genuine gemstone clarity, prong alignment, and refractive index.",
  "AI Neural Lighting automatically mirrors high-end jewelry editorial shoots.",
  "Calibrating real-world gold carat and platinum metallic reflections.",
  "Ensuring natural physical drape and anatomical perspective on the model.",
];

export function LiveProgress() {
  const [stageIndex, setStageIndex] = React.useState(0);
  const [tipIndex, setTipIndex] = React.useState(0);

  React.useEffect(() => {
    const stageInterval = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 4000);

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LUXURY_TIPS.length);
    }, 5500);

    return () => {
      clearInterval(stageInterval);
      clearInterval(tipInterval);
    };
  }, []);

  const currentStage = STAGES[stageIndex];

  return (
    <div className="w-full bg-[#FAF7F2] border border-[#E9DFC8] rounded-3xl p-6 sm:p-7 shadow-xl animate-in fade-in duration-500 overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D8B77E]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#8C6428]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with pulsating diamond animation */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-4">
          {/* Pulsating Luxury Gem Core */}
          <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
            {/* Concentric pulse rings */}
            <span className="absolute inset-0 rounded-2xl bg-[#D8B77E]/30 animate-ping opacity-75" />
            <span className="absolute -inset-1 rounded-2xl border border-[#D8B77E]/50 animate-pulse" />
            
            {/* Central Badge */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2A2622] via-[#1A1715] to-[#121110] border border-[#D8B77E] flex items-center justify-center text-[#D8B77E] shadow-lg">
              <Gem className="w-6 h-6 animate-bounce" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#1A1715] tracking-tight">
                Neural Virtual Try-On Studio
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EDE6DC] text-[#8C6428] border border-[#D8B77E]/40 animate-pulse">
                Rendering
              </span>
            </div>
            <p className="text-xs text-[#7A6E61] mt-0.5 flex items-center gap-1.5 font-medium">
              <Wand2 className="w-3.5 h-3.5 text-[#8C6428]" />
              {currentStage.label}
            </p>
          </div>
        </div>

        {/* Live percentage pill */}
        <div className="text-right shrink-0">
          <div className="inline-flex items-baseline gap-1 px-3.5 py-1.5 rounded-2xl bg-[#1A1715] text-[#FBF9F5] shadow-md border border-[#3E3832]">
            <span className="text-lg font-bold font-serif text-[#D8B77E]">
              {currentStage.progress}%
            </span>
            <span className="text-[10px] text-[#A89F91] uppercase tracking-wider">
              Complete
            </span>
          </div>
          <p className="text-[10px] text-[#8C6428] font-semibold mt-1 text-center sm:text-right">
            ~10–25s Remaining
          </p>
        </div>
      </div>

      {/* Animated Shimmering Progress Bar */}
      <div className="w-full relative z-10 space-y-2">
        <div className="w-full h-3 rounded-full bg-[#EDE6DC] p-0.5 overflow-hidden shadow-inner border border-[#E2DBD1]">
          <div
            className="h-full rounded-full animate-gold-shimmer transition-all duration-1000 ease-out relative shadow-sm"
            style={{ width: `${currentStage.progress}%` }}
          >
            {/* Trailing sparkle tip */}
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#FFF]" />
          </div>
        </div>

        {/* Current micro-step detail */}
        <div className="flex items-center justify-between text-[11px] text-[#7A6E61] pt-1 px-1">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#8C6428]" />
            <span className="font-semibold text-[#1A1715]">Active Operation:</span>{" "}
            {currentStage.detail}
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] text-[#8A8175]">
            2K UHD Master Quality
          </span>
        </div>
      </div>

      {/* Live Stage Sequence Indicators */}
      <div className="grid grid-cols-5 gap-2 mt-5 pt-4 border-t border-[#EAE3D5] relative z-10">
        {STAGES.map((s, idx) => {
          const isDone = idx < stageIndex;
          const isCurrent = idx === stageIndex;

          return (
            <div key={idx} className="flex flex-col items-center text-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${
                  isDone
                    ? "bg-[#1A1715] text-[#D8B77E] shadow-sm"
                    : isCurrent
                    ? "bg-[#D8B77E] text-[#1A1715] ring-4 ring-[#D8B77E]/30 animate-pulse scale-110"
                    : "bg-[#EAE3D5] text-[#9E9385]"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D8B77E]" />
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={`text-[9px] mt-1.5 font-medium leading-tight hidden sm:block ${
                  isCurrent
                    ? "text-[#1A1715] font-bold"
                    : isDone
                    ? "text-[#6B645D]"
                    : "text-[#A89F91]"
                }`}
              >
                Step {idx + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* Rotating Studio Quality Note */}
      <div className="mt-5 p-3 rounded-2xl bg-white/80 border border-[#E8DFC9] flex items-center gap-2.5 text-xs text-[#6B645D] relative z-10 backdrop-blur-sm">
        <Sparkles className="w-4 h-4 text-[#8C6428] shrink-0 animate-spin" style={{ animationDuration: "8s" }} />
        <p className="italic transition-opacity duration-300">
          "{LUXURY_TIPS[tipIndex]}"
        </p>
      </div>
    </div>
  );
}
