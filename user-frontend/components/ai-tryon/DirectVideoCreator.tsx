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
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Eye,
  Maximize2,
  UserCheck,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { JEWELRY_CATEGORIES } from "../../constants/categories";
import { generateVideoApi, GeneratedVideoResult } from "../../services/api";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { VideoModal } from "../video/VideoModal";
import { VideoProjectsModal } from "../video/VideoProjectsModal";
import {
  REAL_VIDEO_PROJECTS,
  FASHION_VIDEO_MODELS,
  VideoProject,
  VideoProjectModelPersona,
} from "../../constants/sample-video-projects";

interface DirectVideoCreatorProps {
  onOpenHistory?: () => void;
  initialImageUrl?: string | null;
  initialFile?: File | null;
  initialCategory?: string | null;
  initialMotionStyle?: MotionStyle;
  storyboardImages?: string[] | null;
  videoResult?: GeneratedVideoResult | null;
  onUpdateVideoResult?: (result: GeneratedVideoResult | null) => void;
  onSyncJewelry?: (file: File | null, previewUrl: string | null, category?: string) => void;
}

type MotionStyle = "ugc-cinematic" | "head-turn" | "editorial-smile" | "subtle-sparkle" | "runway-pose";
type VideoAspectRatio = "9:16" | "4:5" | "16:9";

export function DirectVideoCreator({
  onOpenHistory,
  initialImageUrl,
  initialFile,
  initialCategory,
  initialMotionStyle,
  storyboardImages,
  videoResult: externalVideoResult,
  onUpdateVideoResult,
  onSyncJewelry,
}: DirectVideoCreatorProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(initialFile || null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(initialImageUrl || null);
  const [storyboardList, setStoryboardList] = React.useState<string[]>(
    storyboardImages || []
  );
  const [aspectRatio, setAspectRatio] = React.useState<VideoAspectRatio>("9:16");
  const [motionStyle, setMotionStyle] = React.useState<MotionStyle>(
    initialMotionStyle || "ugc-cinematic"
  );
  const [category, setCategory] = React.useState<string>(initialCategory || "Necklaces & Pendants");
  const [selectedModelPersona, setSelectedModelPersona] = React.useState<VideoProjectModelPersona>(
    FASHION_VIDEO_MODELS[0]
  );
  const [durationSeconds, setDurationSeconds] = React.useState<number>(18);
  const [customPrompt, setCustomPrompt] = React.useState<string>("");
  const [showPromptDetails, setShowPromptDetails] = React.useState<boolean>(false);

  // Modal States
  const [selectedModalProject, setSelectedModalProject] = React.useState<VideoProject | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState<boolean>(false);
  const [isVideoProjectsModalOpen, setIsVideoProjectsModalOpen] = React.useState<boolean>(false);

  const [isRendering, setIsRendering] = React.useState(false);
  const [videoResult, setVideoResult] = React.useState<GeneratedVideoResult | null>(
    externalVideoResult || null
  );
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateVideoResult = (res: GeneratedVideoResult | null) => {
    setVideoResult(res);
    onUpdateVideoResult?.(res);
  };

  // Sync if initial image changes, storyboard arrives, or externalVideoResult changes
  React.useEffect(() => {
    if (initialImageUrl && !selectedFile && previewUrl !== initialImageUrl) {
      setPreviewUrl(initialImageUrl);
      if (initialMotionStyle) {
        setMotionStyle(initialMotionStyle);
      } else if (
        initialImageUrl.includes("lifestyle-ugc") ||
        initialImageUrl.includes("shot_6") ||
        (storyboardImages && storyboardImages.length > 0)
      ) {
        setMotionStyle("ugc-cinematic");
        setDurationSeconds(18);
      }
    }
    if (initialFile && selectedFile !== initialFile) {
      setSelectedFile(initialFile);
    }
    if (initialCategory && category !== initialCategory) {
      setCategory(initialCategory);
    }
    if (storyboardImages && storyboardImages.length > 0) {
      setStoryboardList(storyboardImages);
      setMotionStyle("ugc-cinematic");
      setDurationSeconds(18);
    }
    if (externalVideoResult !== undefined && externalVideoResult !== videoResult) {
      setVideoResult(externalVideoResult);
    }
  }, [initialImageUrl, initialFile, initialCategory, initialMotionStyle, storyboardImages, externalVideoResult]);

  const setFileAndPreview = (file: File) => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    updateVideoResult(null);
    onSyncJewelry?.(file, objectUrl, category);
  };

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

    setFileAndPreview(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    setFileAndPreview(file);
  };

  const handleUseSample = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    const sampleImg =
      initialImageUrl ||
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80";
    setPreviewUrl(sampleImg);
    setSelectedFile(null);
    setCategory("Necklaces & Pendants");
    updateVideoResult(null);
    toast.info("Loaded sample luxury photoshoot image");
  };

  const handleRenderVideo = async () => {
    if (!selectedFile && !previewUrl) {
      toast.error("Please upload an image first to generate an AI Runway Video.");
      return;
    }

    setIsRendering(true);
    toast.info("Connecting to Google Veo 3.1 Cinema Engine... Synthesizing 1080p motion video.", {
      icon: "🎬",
      duration: 5000,
    });

    try {
      const modelDirective = `Fashion Model: ${selectedModelPersona.name} wearing ${selectedModelPersona.attire}, skin tone: ${selectedModelPersona.skinTone}.`;
      const combinedCustomPrompt = customPrompt.trim()
        ? `${modelDirective} ${customPrompt.trim()}`
        : modelDirective;

      const result = await generateVideoApi({
        imageFile: selectedFile || undefined,
        imageUrl: !selectedFile && previewUrl ? previewUrl : undefined,
        storyboardImages: storyboardList.length > 0 ? storyboardList : undefined,
        category,
        aspectRatio,
        motionStyle,
        durationSeconds,
        customPrompt: combinedCustomPrompt,
      });

      updateVideoResult(result);
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

  const handleCloneProject = (project: VideoProject) => {
    setPreviewUrl(project.sourceJewelryUrl);
    setSelectedFile(null);
    setCategory(project.categoryName);
    setAspectRatio(project.aspectRatio);
    setSelectedModelPersona(project.modelPersona);
    setDurationSeconds(project.durationSeconds);
    setMotionStyle(project.motionStyle);
    setVideoResult(null);
    toast.success(`Loaded "${project.title}" into Video Runway Studio!`);
  };

  const handleOpenVideoResultModal = () => {
    if (!videoResult) return;
    const activeProject: VideoProject = {
      id: videoResult.id,
      title: `${category} Luxury Fashion Campaign Video`,
      subtitle: `${durationSeconds}s Commercial • ${videoResult.aspectRatio} • 60 FPS`,
      category: category.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      categoryName: category,
      aspectRatio: (videoResult.aspectRatio as any) || aspectRatio,
      durationSeconds: videoResult.durationSeconds || durationSeconds,
      motionStyle,
      sourceJewelryUrl: previewUrl || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
      videoUrl: videoResult.videoUrl,
      thumbnailUrl: previewUrl || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
      modelPersona: selectedModelPersona,
      highlights: [
        `100% exact ${category} geometry & stone preservation`,
        "5-stage runway walk with macro push-in & hero close-up",
        `Modeled by ${selectedModelPersona.name} (${selectedModelPersona.badge})`,
        "35mm shallow focus optics with natural reflections",
      ],
      prompt: videoResult.prompt || "Luxury jewelry commercial photoshoot...",
      tags: [category, selectedModelPersona.badge, aspectRatio, `${durationSeconds}s`],
    };
    setSelectedModalProject(activeProject);
    setIsVideoModalOpen(true);
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
                Google Veo 3.1 Cinema
              </span>
            </div>
            <p className="text-xs text-[#7A6E61] mt-0.5">
              Upload any jewelry or model photo to generate cinematic 60fps motion videos for Instagram Reels, Shorts &amp; TikTok.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={() => setIsVideoProjectsModalOpen(true)}
            className="shrink-0 flex items-center gap-1.5 text-xs font-bold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore Real Video Projects</span>
          </Button>

          {onOpenHistory && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenHistory}
              className="shrink-0 flex items-center gap-1.5 border-[#D8C7B0] bg-white text-xs font-semibold text-[#8C6428] hover:bg-[#FAF6EE]"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#B38541]" />
              <span>Past Try-Ons</span>
            </Button>
          )}
        </div>
      </div>

      {/* Real Projects Quick-Showcase Strip */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#FAF7F2] to-[#F5ECE0] border border-[#E8DAC6] space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B38541] animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1715]">
              Real Luxury Campaign Projects (Click to Watch in Video Modal)
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setIsVideoProjectsModalOpen(true)}
            className="text-xs font-bold text-[#B38541] hover:underline flex items-center gap-1"
          >
            <span>View All ({REAL_VIDEO_PROJECTS.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {REAL_VIDEO_PROJECTS.map((proj) => (
            <div
              key={proj.id}
              onClick={() => {
                setSelectedModalProject(proj);
                setIsVideoModalOpen(true);
              }}
              className="group cursor-pointer rounded-xl overflow-hidden bg-white border border-[#E5D7C3] hover:border-[#B38541] hover:shadow-md transition-all p-1.5 flex flex-col"
            >
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-900 mb-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proj.thumbnailUrl}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-black/60 text-[#D8B77E] flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 text-[8px] font-bold text-white uppercase">
                  {proj.durationSeconds}s
                </div>
              </div>
              <p className="text-[10px] font-bold text-[#1A1715] line-clamp-1 group-hover:text-[#B38541] transition-colors">
                {proj.title}
              </p>
              <p className="text-[9px] text-[#8C7A68] truncate">{proj.modelPersona.badge}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 8-Shot Storyboard Filmstrip Bar */}
      {storyboardList.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#171513] via-[#241F1A] to-[#171513] text-white border border-[#D9C4A2]/40 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
              <h4 className="font-serif font-bold text-sm sm:text-base text-[#F8F5EE] flex items-center gap-2">
                <span>🎬 8-Shot Storyboard Reference Locked</span>
                <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-[#D8B77E]/30 text-[#F5E6CC] border border-[#D8B77E]/40 uppercase tracking-wider">
                  7-Scene UGC Engine Active
                </span>
              </h4>
            </div>
            <p className="text-[11px] text-[#D8C7B0]">
              Click any frame to set as primary opening shot (all 8 shots are conditioned in prompt)
            </p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {storyboardList.map((imgUrl, idx) => {
              const labels = [
                "1. Showcase",
                "2. Front View",
                "3. Pendant Macro",
                "4. Side Earring",
                "5. Earring Macro",
                "6. UGC Lifestyle",
                "7. Silk Flatlay",
                "8. Hero Portrait",
              ];
              const isSelected = previewUrl === imgUrl;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPreviewUrl(imgUrl);
                    setSelectedFile(null);
                    toast.info(`Opening shot set to: ${labels[idx] || `Shot ${idx + 1}`}`);
                  }}
                  className={cn(
                    "group relative aspect-[3/4] rounded-xl overflow-hidden border transition-all text-left",
                    isSelected
                      ? "border-[#D8B77E] ring-2 ring-[#D8B77E] shadow-md scale-[1.03]"
                      : "border-white/20 hover:border-white/50 opacity-80 hover:opacity-100"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={labels[idx] || `Shot ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                    <span className="text-[8px] font-bold text-white truncate w-full">
                      {labels[idx]?.split(". ")[1] || `Shot ${idx + 1}`}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D8B77E] text-[#1A1715] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  {
                    id: "ugc-cinematic",
                    title: "📱 UGC Cinematic Lifestyle",
                    desc: "Candid hand touching/adjusting jewelry, authentic natural smile, warm boutique lighting",
                    badge: "Trending UGC",
                  },
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
                      "p-2.5 rounded-xl border text-left transition-all relative overflow-hidden",
                      motionStyle === item.id
                        ? "border-[#B38541] bg-[#FAF5EB] shadow-xs ring-1 ring-[#B38541]"
                        : "border-[#E8DFD3] bg-white hover:border-[#D5C6B4]"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-[#1A1715]">{item.title}</p>
                      {"badge" in item && item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#D8B77E]/20 text-[#8C6428] border border-[#D8B77E]/30 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#8C7A68] mt-0.5 leading-tight">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Fashion Model Persona Selection ("Modal More") */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1A1715] flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#B38541]" />
                  <span>Choose Fashion Model Persona</span>
                </label>
                <span className="text-[10px] text-[#8C7A68]">6 Diverse Luxury Personas</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FASHION_VIDEO_MODELS.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedModelPersona(model)}
                    className={cn(
                      "p-2 rounded-xl border text-left transition-all flex items-center gap-2",
                      selectedModelPersona.id === model.id
                        ? "border-[#B38541] bg-[#FAF5EB] shadow-xs"
                        : "border-[#E8DFD3] bg-white hover:border-[#D5C6B4]"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={model.avatarUrl}
                      alt={model.name}
                      className="w-8 h-8 rounded-lg object-cover shrink-0 border border-[#E0D4C3]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-[#1A1715] truncate">{model.name}</p>
                      <p className="text-[9px] text-[#8C7A68] truncate">{model.badge}</p>
                    </div>
                    {selectedModelPersona.id === model.id && (
                      <Check className="w-3.5 h-3.5 text-[#B38541] shrink-0" />
                    )}
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

            {/* Campaign Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1A1715] flex items-center justify-between">
                <span>Campaign Video Duration</span>
                <span className="text-[10px] text-[#8C7A68] font-normal">15–20s Luxury Runway Campaign</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { sec: 15, label: "15 Seconds", sub: "Standard Commercial" },
                  { sec: 18, label: "18 Seconds", sub: "Extended Macro" },
                  { sec: 20, label: "20 Seconds", sub: "Full Editorial Runway" },
                ].map((item) => (
                  <button
                    key={item.sec}
                    type="button"
                    onClick={() => setDurationSeconds(item.sec)}
                    className={cn(
                      "p-2 rounded-xl border text-center transition-all",
                      durationSeconds === item.sec
                        ? "border-[#B38541] bg-[#FAF5EB] shadow-xs"
                        : "border-[#E8DFD3] bg-white hover:border-[#D5C6B4]"
                    )}
                  >
                    <p className="text-xs font-bold text-[#1A1715]">{item.label}</p>
                    <p className="text-[9px] text-[#8C7A68]">{item.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Master Luxury Campaign Specifications Badge */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#FCFAF7] to-[#F5ECE0] border border-[#E6DAC8] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C6428]">
                  <ShieldCheck className="w-4 h-4 text-[#B38541]" />
                  <span>Exact Reference Product Fidelity Mandate</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPromptDetails(!showPromptDetails)}
                  className="text-[11px] font-semibold text-[#B38541] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>{showPromptDetails ? "Hide Prompt" : "View Prompt"}</span>
                  {showPromptDetails ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#7A6E61] leading-relaxed">
                Active video prompt enforces 100% preservation of jewelry geometry, stone counts, metal texture, 5-stage runway walk with macro reveal, soft luxury lighting, and strict anti-CGI negative filters.
              </p>

              {showPromptDetails && (
                <div className="mt-3 pt-3 border-t border-[#E8DAC6] space-y-2.5 animate-in fade-in duration-150">
                  <div className="p-2.5 rounded-lg bg-white/90 border border-[#E0D2BE] text-[10px] text-[#4A4036] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
{`Create a photorealistic luxury jewelry fashion campaign video (${durationSeconds}s) using the uploaded jewelry image as the EXACT REFERENCE PRODUCT.
- Style: Luxury jewelry commercial / premium photoshoot, photorealistic live-action.
- Model Performance: Slowly walks toward camera; 5-stage progression (full shot -> push closer -> macro product shot -> angle -> 2-3s hero close-up).
- Category Focus: Tailored optics & physical attachment for ${category}.
- Optics: 35mm lens depth of field, soft studio key/fill lighting, zero bloom.
- Product Fidelity: 100% stone & metal preservation. Never redesign or distort.
- Negative Filters: Anti-CGI, anti-plastic skin, anti-warping.`}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1A1715]">
                      Custom Director Instructions (Optional):
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Add specific styling, model attire or background mood (e.g. Royal emerald evening gala, silk ivory saree, subtle candlelight accents)..."
                      className="w-full h-16 p-2 rounded-lg border border-[#D9CEBF] bg-white text-xs text-[#1A1715] placeholder:text-[#9C8F80] focus:outline-none focus:ring-1 focus:ring-[#B38541]"
                    />
                  </div>
                </div>
              )}
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
              <span>{isRendering ? "Rendering 1080p Cinema Video with Google Veo 3.1..." : "Render AI Runway Video (Google Veo 3.1)"}</span>
            </Button>

            {isRendering && (
              <div className="p-3 rounded-xl bg-[#FAF5EB] border border-[#E6DAC8] flex items-center gap-3 animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-[#B38541] animate-ping" />
                <p className="text-xs text-[#7A6237] font-medium">
                  Google Veo 3.1 Cinema Engine active: Generating 1080p photorealistic jewelry motion take with authentic light caustics (~45s)...
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

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="gold"
                  size="md"
                  onClick={handleOpenVideoResultModal}
                  className="flex items-center gap-1.5 font-bold text-xs shadow-md"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Open Full Video Modal</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 font-bold text-xs text-white border-white/30 hover:bg-white/10"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP4</span>
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

      {/* Full Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        project={selectedModalProject}
        onUseInStudio={handleCloneProject}
      />

      {/* Real Projects Gallery Modal */}
      <VideoProjectsModal
        isOpen={isVideoProjectsModalOpen}
        onClose={() => setIsVideoProjectsModalOpen(false)}
        onSelectProject={(project) => {
          setSelectedModalProject(project);
          setIsVideoModalOpen(true);
        }}
        onCloneToStudio={handleCloneProject}
      />
    </div>
  );
}
