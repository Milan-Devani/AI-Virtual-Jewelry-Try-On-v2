import * as React from "react";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-8 pb-6 text-center max-w-3xl mx-auto px-4">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4EFE7] border border-[#E8DEC8] text-xs font-medium text-[#7A561E] mb-4">
        <Sparkles className="w-3.5 h-3.5 text-[#B38541]" />
        <span>Gemini 2.5 / 3.1 Luxury Neural Rendering Engine</span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-[#1A1715] leading-[1.15] mb-3">
        Create realistic jewelry <br className="hidden sm:inline" />
        try-on images with AI.
      </h1>

      <p className="text-sm sm:text-base text-[#6E675F] max-w-xl mx-auto font-normal leading-relaxed">
        Upload your model and actual jewelry product. Generate studio-grade Indian &amp; luxury e-commerce imagery while strictly preserving face identity and product fidelity.
      </p>

      <div className="flex items-center justify-center gap-6 mt-5 text-xs text-[#7A736B]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#8C6428]" />
          <span>Identity Preserving</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#8C6428]" />
          <span>Exact Product Fidelity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-[#8C6428]" />
          <span>2K/4K Commercial Export</span>
        </div>
      </div>
    </section>
  );
}
