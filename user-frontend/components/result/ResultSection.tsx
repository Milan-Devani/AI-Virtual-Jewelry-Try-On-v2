import * as React from "react";
import { Download, RefreshCw, SlidersHorizontal, Image as ImageIcon, Sparkles, Check } from "lucide-react";
import { TryOnGenerationResult } from "../../types";
import { Button } from "../ui/button";
import { ComparisonSlider } from "./ComparisonSlider";
import { generateDownloadFilename } from "../../lib/utils";
import { toast } from "sonner";

interface ResultSectionProps {
  result: TryOnGenerationResult;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export function ResultSection({
  result,
  onRegenerate,
  isRegenerating,
}: ResultSectionProps) {
  const [viewMode, setViewMode] = React.useState<"result" | "compare">("compare");
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const filename = generateDownloadFilename(result.category, result.createdAt);

      const response = await fetch(result.imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Try-on image downloaded successfully!", {
        description: `Saved as ${filename}`,
      });
    } catch (err) {
      toast.error("Failed to download image directly. Opening in new tab instead.");
      window.open(result.imageUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="w-full bg-white border border-[#E8E1D6] rounded-3xl p-6 sm:p-8 shadow-card mt-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EBE3]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF6EC] border border-[#E9DAC1] text-xs font-semibold text-[#8C6428] mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B38541]" />
            <span>Virtual Try-On Generated Successfully</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1715]">
            {result.categoryName} Virtual Try-On
          </h2>
          <p className="text-xs text-[#7A736B] mt-0.5">
            {result.aspectRatio} • {result.imageSize} Quality • {result.background.toUpperCase()} Background
            {result.durationMs ? ` • Generated in ${(result.durationMs / 1000).toFixed(1)}s` : ""}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex p-1 bg-[#F5EFE8] rounded-xl border border-[#E5DFD6]">
          <button
            type="button"
            onClick={() => setViewMode("compare")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "compare"
                ? "bg-white text-[#1A1715] shadow-sm"
                : "text-[#736D66] hover:text-[#1A1715]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Before / After</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("result")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "result"
                ? "bg-white text-[#1A1715] shadow-sm"
                : "text-[#736D66] hover:text-[#1A1715]"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Solo Result</span>
          </button>
        </div>
      </div>

      {/* Main Visual Display */}
      <div className="py-6 flex justify-center">
        {viewMode === "compare" ? (
          <ComparisonSlider
            originalUrl={result.modelImageUrl || result.jewelryImageUrl}
            generatedUrl={result.imageUrl}
            categoryName={result.categoryName}
            aspectRatio={result.aspectRatio}
          />
        ) : (
          <div className="relative w-full max-w-xl aspect-[4/5] rounded-2xl overflow-hidden border border-[#E2DAD0] shadow-md bg-[#EDE6DC]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.imageUrl}
              alt="Generated AI Try-On"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-[#F0EBE3] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-[#7A736B] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1E7748]" />
          <span>Model face identity &amp; product fidelity preserved</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            disabled={isRegenerating}
            isLoading={isRegenerating}
            onClick={onRegenerate}
            className="flex-1 sm:flex-none flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Regenerate</span>
          </Button>

          <Button
            variant="gold"
            size="md"
            disabled={isDownloading}
            isLoading={isDownloading}
            onClick={handleDownload}
            className="flex-1 sm:flex-none flex items-center gap-2 px-6"
          >
            <Download className="w-4 h-4" />
            <span>Download 2K HD</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
