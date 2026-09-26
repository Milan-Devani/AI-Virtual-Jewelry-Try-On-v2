import * as React from "react";
import {
  Download,
  RefreshCw,
  SlidersHorizontal,
  Image as ImageIcon,
  Sparkles,
  Video,
  Play,
  Pause,
  Film,
  Check,
  Share2,
  Maximize2,
  ArrowRight,
} from "lucide-react";
import { TryOnGenerationResult } from "../../types";
import { Button } from "../ui/button";
import { ComparisonSlider } from "./ComparisonSlider";
import { generateDownloadFilename } from "../../lib/utils";
import { normalizeMediaUrl, generateVideoApi, GeneratedVideoResult } from "../../services/api";
import { toast } from "sonner";
import { VideoModal } from "../video/VideoModal";
import { VideoProject } from "../../constants/sample-video-projects";

interface ResultSectionProps {
  result: TryOnGenerationResult;
  onRegenerate: () => void;
  isRegenerating?: boolean;
  onNavigateToVideo?: (imageUrl: string, category?: string) => void;
}

type MotionStyle = "head-turn" | "editorial-smile" | "subtle-sparkle" | "runway-pose" | "ugc-cinematic";
type VideoAspectRatio = "9:16" | "4:5" | "16:9";

export function ResultSection({
  result,
  onRegenerate,
  isRegenerating,
  onNavigateToVideo,
}: ResultSectionProps) {
  const [viewMode, setViewMode] = React.useState<"result" | "compare" | "video">("compare");
  const [isDownloading, setIsDownloading] = React.useState(false);

  // Video Generation States
  const [isGeneratingVideo, setIsGeneratingVideo] = React.useState(false);
  const [videoResult, setVideoResult] = React.useState<GeneratedVideoResult | null>(null);
  const [motionStyle, setMotionStyle] = React.useState<MotionStyle>("head-turn");
  const [videoAspectRatio, setVideoAspectRatio] = React.useState<VideoAspectRatio>("9:16");
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const activeImageUrl = normalizeMediaUrl(result.imageUrl);
  const activeOriginalUrl = normalizeMediaUrl(result.modelImageUrl || result.jewelryImageUrl);

  const handleDownload = async (urlToDownload?: string, customExt = "webp") => {
    const targetUrl = urlToDownload || activeImageUrl;
    try {
      setIsDownloading(true);
      const filename = `${result.category}-tryon-${Date.now()}.${customExt}`;

      const response = await fetch(targetUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success(`${customExt.toUpperCase()} downloaded successfully!`, {
        description: `Saved as ${filename}`,
      });
    } catch (err) {
      toast.error("Opening media in new tab instead.");
      window.open(targetUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerateVideo = async () => {
    try {
      setIsGeneratingVideo(true);
      toast.info("Submitting AI Video request...", {
        description: "Rendering photorealistic cinema motion with Google Veo 3.1 (~45s).",
      });

      const video = await generateVideoApi({
        imageUrl: result.imageUrl,
        category: result.categoryName || result.category,
        aspectRatio: videoAspectRatio,
        motionStyle,
        durationSeconds: 15,
      });

      setVideoResult(video);
      setViewMode("video");
      toast.success("AI Video generated successfully!", {
        description: "1080p social media runway video is ready to play and download.",
      });
    } catch (err: any) {
      toast.error("Video Generation Failed", {
        description: err.message || "Please check Hugging Face server availability.",
      });
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const togglePlayVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
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

          {videoResult ? (
            <button
              type="button"
              onClick={() => setViewMode("video")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "video"
                  ? "bg-[#1A1715] text-[#D8B77E] shadow-sm font-bold"
                  : "text-[#736D66] hover:text-[#1A1715]"
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#D8B77E]" />
              <span>AI Video</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("ai-video-drawer");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#8C6428] hover:bg-white/60 transition-all"
            >
              <Film className="w-3.5 h-3.5 text-[#B38541]" />
              <span>Render AI Video</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Visual Display */}
      <div className="py-6 flex justify-center">
        {viewMode === "video" && videoResult ? (
          <div className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] rounded-3xl overflow-hidden border-2 border-[#D8B77E]/60 shadow-2xl bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoResult.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              crossOrigin="anonymous"
              className="w-full h-full object-cover cursor-pointer"
              onClick={togglePlayVideo}
              onError={(e) => {
                console.error("Video load error for URL:", videoResult.videoUrl, e);
              }}
            />

            {/* Video overlay controls */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>AI RUNWAY 1080P</span>
            </div>

            <button
              type="button"
              onClick={togglePlayVideo}
              className="absolute bottom-4 right-4 p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-transform active:scale-95"
            >
              {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
          </div>
        ) : viewMode === "compare" ? (
          <ComparisonSlider
            originalUrl={activeOriginalUrl}
            generatedUrl={activeImageUrl}
            categoryName={result.categoryName}
            aspectRatio={result.aspectRatio}
          />
        ) : (
          <div className="relative w-full max-w-xl aspect-[4/5] rounded-2xl overflow-hidden border border-[#E2DAD0] shadow-md bg-[#EDE6DC]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImageUrl}
              alt="Generated AI Try-On"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* AI Video Creator Drawer Banner */}
      <div
        id="ai-video-drawer"
        className="my-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FCFBF8] via-[#FAF6EE] to-[#F5EFE3] border border-[#E6DBCA] shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#1A1715] text-[#D8B77E]">
                <Film className="w-4 h-4" />
              </span>
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#1A1715]">
                Turn into AI Runway Video (Reels &amp; Shorts)
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                Google Veo 3.1 Cinema
              </span>
            </div>
            <p className="text-xs text-[#7A736B]">
              Generates dynamic 60fps editorial motion with real skin pores, hair breeze, and physical jewelry sparkles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Aspect Ratio Selector */}
            <select
              value={videoAspectRatio}
              onChange={(e) => setVideoAspectRatio(e.target.value as VideoAspectRatio)}
              disabled={isGeneratingVideo}
              className="h-9 px-2.5 rounded-xl border border-[#D9CEBF] bg-white text-xs font-semibold text-[#1A1715] focus:outline-none focus:ring-2 focus:ring-[#B38541]"
            >
              <option value="9:16">9:16 Reels &amp; TikTok (1080p)</option>
              <option value="4:5">4:5 Instagram Feed (2K)</option>
              <option value="16:9">16:9 Landscape Video</option>
            </select>

            {/* Motion Style Selector */}
            <select
              value={motionStyle}
              onChange={(e) => setMotionStyle(e.target.value as MotionStyle)}
              disabled={isGeneratingVideo}
              className="h-9 px-2.5 rounded-xl border border-[#D9CEBF] bg-white text-xs font-semibold text-[#1A1715] focus:outline-none focus:ring-2 focus:ring-[#B38541]"
            >
              <option value="ugc-cinematic">📱 UGC Cinematic Lifestyle</option>
              <option value="head-turn">✨ Gentle Head Turn &amp; Sparkle</option>
              <option value="editorial-smile">💎 Editorial Smile &amp; Gaze</option>
              <option value="subtle-sparkle">🔍 Micro Caustic Glint</option>
              <option value="runway-pose">💃 Runway Pose</option>
            </select>

            {/* Video Generate Button */}
            <Button
              variant="primary"
              size="md"
              disabled={isGeneratingVideo}
              isLoading={isGeneratingVideo}
              onClick={handleGenerateVideo}
              className="flex items-center gap-2 bg-[#1A1715] hover:bg-[#2A2622] text-[#FBF9F5] border border-[#3E3832] px-4 font-bold text-xs"
            >
              <Video className="w-3.5 h-3.5 text-[#D8B77E]" />
              <span>{isGeneratingVideo ? "Rendering 1080p Video..." : "Render AI Runway Video"}</span>
            </Button>

            {onNavigateToVideo && (
              <Button
                variant="outline"
                size="md"
                type="button"
                onClick={() => onNavigateToVideo(result.imageUrl, result.categoryName || result.category)}
                className="flex items-center gap-1.5 border-[#D9CEBF] bg-white hover:bg-[#FAF6EE] text-[#1A1715] px-3 font-semibold text-xs h-9"
              >
                <span>Studio Runway</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B38541]" />
              </Button>
            )}
          </div>
        </div>

        {/* Video generating status banner */}
        {isGeneratingVideo && (
          <div className="mt-3 p-3 rounded-xl bg-white/80 border border-[#E5DAC6] flex items-center gap-3 animate-pulse">
            <div className="w-3 h-3 rounded-full bg-[#B38541] animate-ping" />
            <p className="text-xs text-[#7A6237] font-medium">
              Generating cinema-grade jewelry motion video via Google Veo 3.1. Simulating authentic light caustics and physical jewelry reflections...
            </p>
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
            <span>Regenerate Image</span>
          </Button>

          {viewMode === "video" && videoResult ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsVideoModalOpen(true)}
                className="flex items-center gap-1.5 border-[#D8C7B0] text-xs font-bold"
              >
                <Maximize2 className="w-4 h-4 text-[#B38541]" />
                <span>Open Video Modal</span>
              </Button>
              <Button
                variant="gold"
                size="md"
                disabled={isDownloading}
                isLoading={isDownloading}
                onClick={() => handleDownload(videoResult.videoUrl, "mp4")}
                className="flex items-center gap-2 px-6 text-xs font-bold"
              >
                <Download className="w-4 h-4" />
                <span>Download 1080p MP4</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="gold"
              size="md"
              disabled={isDownloading}
              isLoading={isDownloading}
              onClick={() => handleDownload()}
              className="flex-1 sm:flex-none flex items-center gap-2 px-6"
            >
              <Download className="w-4 h-4" />
              <span>Download HD</span>
            </Button>
          )}
        </div>
      </div>

      {/* Video Modal Integration */}
      {videoResult && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          project={{
            id: videoResult.id,
            title: `${result.categoryName || result.category} Luxury Runway Campaign`,
            subtitle: `15s Commercial • ${videoResult.aspectRatio} • 60 FPS`,
            category: result.category,
            categoryName: result.categoryName || result.category,
            aspectRatio: (videoResult.aspectRatio as any) || videoAspectRatio,
            durationSeconds: videoResult.durationSeconds || 15,
            motionStyle,
            sourceJewelryUrl: result.jewelryImageUrl || result.imageUrl,
            videoUrl: videoResult.videoUrl,
            thumbnailUrl: result.imageUrl,
            modelPersona: {
              id: "active-tryon-model",
              name: "Campaign Fashion Model",
              attire: "Luxury Haute Couture Campaign Styling",
              skinTone: "Radiant Studio Lighting",
              badge: "Studio Model",
              gender: "female",
              avatarUrl: result.modelImageUrl || result.imageUrl,
              description: "High-fashion commercial editorial motion.",
            },
            highlights: [
              `100% exact ${result.categoryName || result.category} preservation`,
              "5-stage luxury runway progression & hero close-up",
              "Ray-traced caustics and 35mm shallow focus",
            ],
            prompt: videoResult.prompt || "Luxury jewelry commercial photoshoot...",
            tags: [result.category, videoAspectRatio, "15s", "1080p"],
          }}
        />
      )}
    </section>
  );
}

