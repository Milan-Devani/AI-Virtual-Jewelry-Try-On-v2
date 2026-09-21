"use client";

import * as React from "react";
import {
  Upload,
  Film,
  Video,
  Play,
  Pause,
  Download,
  Sparkles,
  RefreshCw,
  Sliders,
  Check,
  FolderOpen,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { Button } from "../ui/button";
import { JEWELRY_CATEGORIES } from "../../constants/categories";
import { generateVideoApi, GeneratedVideoResult } from "../../services/api";
import { toast } from "sonner";
import { cn } from "../../lib/utils";

interface DirectVideoCreatorProps {
  onOpenHistory?: () => void;
  initialImageUrl?: string | null;
}

type MotionStyle = "head-turn" | "editorial-smile" | "subtle-sparkle" | "runway-pose";
type VideoAspectRatio = "9:16" | "4:5" | "16:9";

export function DirectVideoCreator({
  onOpenHistory,
  initialImageUrl,
}: DirectVideoCreatorProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(initialImageUrl || null);
  const [aspectRatio, setAspectRatio] = React.useState<VideoAspectRatio>("9:16");
  const [motionStyle, setMotionStyle] = React.useState<MotionStyle>("head-turn");
  const [category, setCategory] = React.useState<string>("Necklaces & Pendants");

  const [isRendering, setIsRendering] = React.useState(false);
  const [videoResult, setVideoResult] = React.useState<GeneratedVideoResult | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync if initial image changes
  React.useEffect(() => {
    if (initialImageUrl) {
      setPreviewUrl(initialImageUrl);
      setSelectedFile(null);
    }
  }, [initialImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, or WebP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image file size exceeds the 8MB limit.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setVideoResult(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setVideoResult(null);
  };

  const handleUseSample = () => {
    const sampleImg =
      initialImageUrl ||
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80";
    setPreviewUrl(sampleImg);
    setSelectedFile(null);
    setCategory("Necklaces & Pendants");
    setVideoResult(null);
    toast.info("Loaded sample luxury photoshoot image");
  };

  const handleRenderVideo = async () => {
    if (!selectedFile && !previewUrl) {
      toast.error("Please upload an image first to generate an AI Runway Video.");
      return;
    }

    setIsRendering(true);
    toast.info("Connecting to Wan 2.1 GPU engine... Synthesizing 1080p motion video.", {
      icon: "🎬",
      duration: 5000,
    });

    try {
      const result = await generateVideoApi({
        imageFile: selectedFile || undefined,
        imageUrl: !selectedFile && previewUrl ? previewUrl : undefined,
        category,
        aspectRatio,
        motionStyle,
        durationSeconds: 3,
      });

      setVideoResult(result);
      setIsVideoPlaying(true);
      const remainingMsg = result.credits
        ? `1 credit used • ${result.credits.remainingCredits} credits remaining`
        : "1080p Full HD motion video ready.";
      toast.success("AI Runway Video rendered successfully!", {
        icon: "✨",
        description: remainingMsg,
      });
    } catch (err: any) {
      toast.error("Video Generation Failed", {
        description: err?.message || "All video GPU workers were busy. Please try again.",
      });
    } finally {
      setIsRendering(false);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const handleDownload = async () => {
    if (!videoResult?.videoUrl) return;
    try {
      const filename = `jewelai-runway-${Date.now()}.mp4`;
      const res = await fetch(videoResult.videoUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Downloaded 1080p MP4 Video!");
    } catch {
      window.open(videoResult.videoUrl, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF5EC] via-[#F8EFE1] to-[#F5E8D4] border border-[#E8DAC6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1A1715] flex items-center justify-center text-[#D8B77E] shrink-0 shadow-sm">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-serif font-bold text-[#1A1715]">
                Direct Image-to-Video Runway Studio
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                Wan 2.1 Free
              </span>
            </div>
            <p className="text-xs text-[#7A6E61] mt-0.5">
              Upload any jewelry or model photo to generate cinematic 60fps motion videos for Instagram Reels, Shorts &amp; TikTok.
            </p>
          </div>
        </div>

        {onOpenHistory && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenHistory}
            className="shrink-0 flex items-center gap-1.5 border-[#D8C7B0] bg-white text-xs font-semibold text-[#8C6428] hover:bg-[#FAF6EE]"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#B38541]" />
            <span>Pick from Past Try-Ons</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7A736B]">
              1. Source Image to Animate
            </label>
            <button
              type="button"
              onClick={handleUseSample}
              className="text-xs font-semibold text-[#B38541] hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Use Sample Image</span>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          {previewUrl ? (
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#D8C7B0] bg-[#FAF8F5] shadow-sm group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Source to animate"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-[#1A1715] hover:bg-neutral-100 text-xs font-bold"
                >
                  Change Photo
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                    setVideoResult(null);
                  }}
                  className="bg-black/60 text-white border-white/30 hover:bg-black/80 text-xs"
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="w-full aspect-[4/5] rounded-2xl border-2 border-dashed border-[#DCD3C7] hover:border-[#B38541] bg-[#FAF8F5] hover:bg-[#FDFBF7] transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center space-y-3 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F0EAE1] group-hover:bg-[#EAE1D5] flex items-center justify-center text-[#8C6428] transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-bold text-[#1A1715]">
                  Click or drag photo here
                </p>
                <p className="text-[11px] text-[#8C8377]">
                  Upload any jewelry try-on or model image (JPEG, PNG, WebP up to 8MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Video Settings & Result (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Settings Grid */}
          <div className="p-5 rounded-2xl bg-[#FCFAF8] border border-[#EAE3D8] space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[#F0EBE3] pb-3">
              <Sliders className="w-4 h-4 text-[#B38541]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1715]">
                2. Social Media &amp; Motion Style
              </h4>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1A1715]">
                Social Media Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "9:16", label: "9:16 Reels & TikTok", sub: "1080p Vertical" },
                  { id: "4:5", label: "4:5 Instagram Feed", sub: "2K Portrait" },
                  { id: "16:9", label: "16:9 Landscape", sub: "YouTube / Web" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAspectRatio(item.id as VideoAspectRatio)}
                    className={cn(
                      "p-2.5 rounded-xl border text-left transition-all",
                      aspectRatio === item.id
                        ? "border-[#B38541] bg-[#FAF5EB] shadow-xs"
                        : "border-[#E8DFD3] bg-white hover:border-[#D5C6B4]"
                    )}
                  >
                    <p className="text-xs font-bold text-[#1A1715]">{item.label}</p>
                    <p className="text-[10px] text-[#8C7A68] mt-0.5">{item.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Motion Direction */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1A1715]">
                Motion Direction &amp; Optical Sparkle
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: "head-turn",
                    title: "✨ Gentle Head Turn",
                    desc: "Model turns to studio light, soft blink & regal smile",
                  },
                  {
                    id: "editorial-smile",
                    title: "💎 Editorial Smile & Gaze",
                    desc: "Chin tilt, serene confident eye contact, warm highlights",
                  },
                  {
                    id: "subtle-sparkle",
                    title: "🔍 Micro Caustic Glint",
                    desc: "Slow micro-pan, diamond caustics & gleaming gold shine",
                  },
                  {
                    id: "runway-pose",
                    title: "💃 High-Fashion Runway",
                    desc: "Shoulder sway, hair catching breeze, 60fps luxury movement",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMotionStyle(item.id as MotionStyle)}
                    className={cn(
                      "p-2.5 rounded-xl border text-left transition-all",
                      motionStyle === item.id
                        ? "border-[#B38541] bg-[#FAF5EB] shadow-xs"
                        : "border-[#E8DFD3] bg-white hover:border-[#D5C6B4]"
                    )}
                  >
                    <p className="text-xs font-bold text-[#1A1715]">{item.title}</p>
                    <p className="text-[10px] text-[#8C7A68] mt-0.5 leading-tight">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1A1715]">
                Jewelry Piece in Frame
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[#D9CEBF] bg-white text-xs font-semibold text-[#1A1715] focus:outline-none focus:ring-2 focus:ring-[#B38541]"
              >
                {JEWELRY_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                <option value="Luxury Jewelry Collection">Full Jewelry Ensemble</option>
              </select>
            </div>

            {/* Render Button */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={isRendering || (!selectedFile && !previewUrl)}
              isLoading={isRendering}
              onClick={handleRenderVideo}
              className="w-full bg-[#1A1715] hover:bg-[#2A2622] text-[#FBF9F5] border border-[#3E3832] py-3.5 font-bold text-sm shadow-md"
            >
              <Video className="w-4 h-4 text-[#D8B77E]" />
              <span>{isRendering ? "Rendering 1080p Video on GPU..." : "Render AI Runway Video (Wan 2.1 Free)"}</span>
            </Button>

            {isRendering && (
              <div className="p-3 rounded-xl bg-[#FAF5EB] border border-[#E6DAC8] flex items-center gap-3 animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-[#B38541] animate-ping" />
                <p className="text-xs text-[#7A6237] font-medium">
                  Wan 2.1 ZeroGPU worker active: Simulating physical light caustics, micro eye blinks &amp; hair physics (~35s)...
                </p>
              </div>
            )}
          </div>

          {/* Generated Video Player Display */}
          {videoResult && (
            <div className="p-5 rounded-2xl bg-black border-2 border-[#D8B77E]/80 shadow-2xl text-white space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D8B77E]">
                    Generated AI Runway Video (1080P)
                  </h4>
                </div>
                <span className="text-[10px] text-white/60">
                  {videoResult.aspectRatio} • 60 FPS
                </span>
              </div>

              <div className="relative w-full max-w-sm mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 border border-white/20">
                <video
                  ref={videoRef}
                  src={videoResult.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={togglePlay}
                />

                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-transform active:scale-95"
                >
                  {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="gold"
                  size="md"
                  onClick={handleDownload}
                  className="flex items-center gap-2 font-bold text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 1080p MP4</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => window.open(videoResult.videoUrl, "_blank")}
                  className="flex items-center gap-1.5 text-xs text-white border-white/30 hover:bg-white/10"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Fullscreen</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
