import * as React from "react";
import { Sparkles, Loader2 } from "lucide-react";

const STAGES = [
  { label: "Preparing reference images...", progress: 18 },
  { label: "Analyzing model facial & anatomical landmarks...", progress: 38 },
  { label: "Extracting exact jewelry geometry & gemstones...", progress: 62 },
  { label: "Synthesizing luxury studio lighting & reflections...", progress: 84 },
  { label: "Applying master 2K photorealistic finish...", progress: 95 },
];

export function LiveProgress() {
  const [stageIndex, setStageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const currentStage = STAGES[stageIndex];

  return (
    <div className="w-full bg-[#FAF6F0] border border-[#E9DFC8] rounded-2xl p-5 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#EFE3CF] text-[#8C6428] flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1A1715]">
              AI Try-On Neural Generation
            </p>
            <p className="text-[11px] text-[#7A6E61]">
              {currentStage.label}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#8C6428]">
          {currentStage.progress}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 rounded-full bg-[#EDE6DC] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D8B77E] to-[#B38541] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${currentStage.progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-3 text-[11px] text-[#8A8175]">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#B38541]" />
          Gemini Multimodal Try-On Engine
        </span>
        <span>Estimated time: 10–25s</span>
      </div>
    </div>
  );
}
