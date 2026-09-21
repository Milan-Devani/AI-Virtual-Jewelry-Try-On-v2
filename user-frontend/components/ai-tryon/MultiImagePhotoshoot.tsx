"use client";

import * as React from "react";
import {
  Sparkles,
  Upload,
  Camera,
  Layers,
  Check,
  Download,
  ExternalLink,
  Film,
  ZoomIn,
  RefreshCw,
  Eye,
  Sliders,
  X,
  ChevronRight,
  ShieldCheck,
  Diamond,
  Maximize2,
  Share2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { JEWELRY_CATEGORIES } from "../../constants/categories";
import { generatePhotoshootApi } from "../../services/api";
import {
  PhotoshootCampaignResult,
  PhotoshootShotResult,
} from "../../types";
import { toast } from "sonner";
import { cn } from "../../lib/utils";

interface MultiImagePhotoshootProps {
  onOpenHistory?: () => void;
  onNavigateToVideo?: (imageUrl: string, category?: string) => void;
}

type PhotoshootTheme = "luxury-studio" | "royal-bridal" | "minimal-white" | "dark-editorial";
type PhotoshootAspectRatio = "4:5" | "1:1" | "16:9";

const THEME_OPTIONS: {
  id: PhotoshootTheme;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
}[] = [
  {
    id: "luxury-studio",
    title: "Luxury Fashion Studio",
    subtitle: "Warm ivory, softboxes, high-end Vogue/Harper's Bazaar editorial lighting",
    icon: "🏛️",
    badge: "Editorial Choice",
  },
  {
    id: "royal-bridal",
    title: "Royal Indian Bridal",
    subtitle: "Regal lehengas & sarees, warm amber caustics, ornate heritage atmosphere",
    icon: "👑",
    badge: "Bridal Couture",
  },
  {
    id: "minimal-white",
    title: "Minimal White E-Commerce",
    subtitle: "Pure crisp white, macro focus, soft contact shadows, ultra-clean catalog",
    icon: "⚪",
    badge: "Commercial",
  },
  {
    id: "dark-editorial",
    title: "Dark Onyx Editorial",
    subtitle: "Dramatic noir moody lighting, rim light reflections, cinematic high-contrast",
    icon: "🖤",
    badge: "Avant-Garde",
  },
];

const SAMPLE_JEWELRY = [
  {
    name: "Emerald & Diamond Royal Haar",
    category: "Necklaces & Pendants",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Polki Kundan Bridal Jhumkas",
    category: "Jhumkas",
    url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Solitaire Pavé Platinum Ring",
    category: "Rings",
    url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Gold Filigree Temple Bangle",
    category: "Bangles",
    url: "https://images.unsplash.com/photo-1611591477281-420bf845659c?w=800&auto=format&fit=crop&q=80",
  },
];

const GENERATION_STAGES = [
  { label: "Locking jewelry geometry, stone count & metal reflectance...", progress: 15 },
  { label: "Synthesizing Shot 1: Hero Model Luxury Campaign Portrait...", progress: 35 },
  { label: "Synthesizing Shot 2: Editorial Alternate Model Profile...", progress: 55 },
  { label: "Synthesizing Shot 3: Commercial E-Commerce Product Hero...", progress: 75 },
  { label: "Synthesizing Shot 4: 45° Side Depth & Setting Profile...", progress: 88 },
  { label: "Synthesizing Shot 5: Ultra-Macro Gemstone & Diamond Detail...", progress: 98 },
];

export function MultiImagePhotoshoot({
  onOpenHistory,
  onNavigateToVideo,
}: MultiImagePhotoshootProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [category, setCategory] = React.useState<string>("Necklaces & Pendants");
  const [theme, setTheme] = React.useState<PhotoshootTheme>("luxury-studio");
  const [aspectRatio, setAspectRatio] = React.useState<PhotoshootAspectRatio>("4:5");

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [progressStageIndex, setProgressStageIndex] = React.useState(0);
  const [campaignResult, setCampaignResult] = React.useState<PhotoshootCampaignResult | null>(null);
  const [selectedShotForModal, setSelectedShotForModal] = React.useState<PhotoshootShotResult | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const progressTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Advance simulated progress indicator during generation
  React.useEffect(() => {
    if (isGenerating) {
      setProgressStageIndex(0);
      let step = 0;
      progressTimerRef.current = setInterval(() => {
        step = Math.min(step + 1, GENERATION_STAGES.length - 1);
        setProgressStageIndex(step);
      }, 7000);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isGenerating]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, or WebP).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File size exceeds 15MB limit.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setCampaignResult(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setCampaignResult(null);
  };

  const handleSelectSample = (sample: (typeof SAMPLE_JEWELRY)[0]) => {
    setSelectedFile(null);
    setPreviewUrl(sample.url);
    setCategory(sample.category);
    setCampaignResult(null);
    toast.info(`Loaded sample jewelry: ${sample.name}`);
  };

  const handleGeneratePhotoshoot = async () => {
    if (!selectedFile && !previewUrl) {
      toast.error("Please upload a jewelry product image to generate your photoshoot.");
      return;
    }

    setIsGenerating(true);
    toast.info("Synthesizing 5-shot luxury photoshoot set... Please wait.", {
      icon: "📸",
      duration: 6000,
    });

    try {
      const result = await generatePhotoshootApi({
        imageFile: selectedFile || undefined,
        imageUrl: !selectedFile && previewUrl ? previewUrl : undefined,
        category,
        theme,
        aspectRatio,
      });

      setCampaignResult(result);
      toast.success("Photoshoot Campaign Generated!", {
        icon: "✨",
        description: `Successfully synthesized ${result.shots.length} high-resolution commercial images.`,
      });
    } catch (err: any) {
      toast.error("Photoshoot Generation Failed", {
        description: err?.message || "Failed to generate photoshoot campaign. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadShot = async (shot: PhotoshootShotResult) => {
    try {
      const filename = `jewelai-${shot.type}-${Date.now()}.webp`;
      const res = await fetch(shot.imageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`Downloaded ${shot.title}`);
    } catch {
      window.open(shot.imageUrl, "_blank");
    }
  };

  const handleDownloadAll = async () => {
    if (!campaignResult?.shots?.length) return;
    toast.info(`Downloading all ${campaignResult.shots.length} photos...`);
    for (const shot of campaignResult.shots) {
      await handleDownloadShot(shot);
      await new Promise((r) => setTimeout(r, 400));
    }
  };

  const handleSendToVideoStudio = (shot: PhotoshootShotResult) => {
    if (onNavigateToVideo) {
      onNavigateToVideo(shot.imageUrl, category);
      toast.success("Image transferred to AI Video Runway Studio!", {
        icon: "🎬",
      });
    } else {
      toast.info("Switch to the 'Image to Video' tab to render video for this shot.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Studio Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B18] via-[#2A241F] to-[#171412] text-white p-6 sm:p-8 border border-[#D9C4A2]/20 shadow-xl">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D8B77E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D8B77E]/20 text-[#EBD5B3] border border-[#D8B77E]/30 uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-[#D8B77E]" />
                Commercial Photoshoot Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/20 text-[#6EE7B7] border border-[#10B981]/30 uppercase tracking-wider">
                1 Upload = 5 Images
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F8F5EE] tracking-tight">
              AI Jewelry Product Photoshoot Generator
            </h2>

            <p className="text-sm text-[#C4B7A6] leading-relaxed">
              Upload <strong>one single jewelry image</strong>. JEWELAI automatically preserves every gemstone, diamond count, and metal detail to generate a complete <strong>4–5 image commercial campaign</strong>: 2–3 luxury model portraits + 2–3 macro product studio angles.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-[#E5D7C2]">
              <ShieldCheck className="w-4 h-4 text-[#D8B77E] shrink-0" />
              <span>Zero-Hallucination Jewelry Preservation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid: Controls + Uploader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Sample Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-[#1A1715] flex items-center gap-2">
              <Diamond className="w-4 h-4 text-[#B38541]" />
              <span>1. Upload Single Jewelry Product Image</span>
            </h3>
            {previewUrl && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setCampaignResult(null);
                }}
                className="text-xs text-[#8C6428] hover:text-[#5E4219] flex items-center gap-1 font-medium"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove &amp; Reupload</span>
              </button>
            )}
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !previewUrl && fileInputRef.current?.click()}
            className={cn(
              "relative rounded-3xl border-2 border-dashed transition-all duration-200 overflow-hidden flex flex-col items-center justify-center min-h-[340px] p-6 text-center",
              previewUrl
                ? "border-[#D9C4A2] bg-[#FAF8F5]"
                : "border-[#D4C8B8] hover:border-[#B38541] bg-[#FCFBF9] hover:bg-[#FAF6EE] cursor-pointer"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center group">
                <div className="relative max-h-[300px] w-auto rounded-2xl overflow-hidden shadow-md border border-[#E8DFC8] bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Uploaded Jewelry Product"
                    className="max-h-[300px] max-w-full object-contain mx-auto"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="bg-white/90 text-xs font-semibold text-[#1A1715] hover:bg-white"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                      Replace
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EAE2D5] text-[#4A4237] text-[11px] font-semibold">
                    <Check className="w-3 h-3 text-[#10B981]" />
                    Product Reference Active
                  </span>
                  {selectedFile && (
                    <span className="text-[11px] text-[#8C7E6C]">
                      ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F5EEDD] to-[#EBDCBE] border border-[#D9C4A2] flex items-center justify-center mx-auto text-[#8C6428] shadow-sm">
                  <Upload className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#1A1715]">
                    Click or Drag &amp; Drop Jewelry Image
                  </p>
                  <p className="text-xs text-[#8C7E6C]">
                    PNG, JPEG, WebP up to 15MB. Clear background or studio shot recommended.
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-[#D4C8B8] text-xs text-[#5E4219] hover:bg-[#F3ECE0]"
                  >
                    Browse Local File
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Sample Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#6E6458] block">
              Or Try A Preset Sample Product:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_JEWELRY.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E8E0D2] hover:border-[#B38541] hover:bg-[#FAF6EE] text-left transition-all group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-9 h-9 rounded-lg object-cover border border-[#E8DFC8] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-[#1A1715] truncate group-hover:text-[#B38541]">
                      {sample.name}
                    </p>
                    <p className="text-[9px] text-[#8C7E6C] truncate">{sample.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Photoshoot Parameters & Generation CTA (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-3xl bg-white border border-[#E8DFC8] shadow-sm space-y-5">
            <h3 className="text-sm font-serif font-bold text-[#1A1715] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#B38541]" />
              <span>2. Campaign Settings &amp; Theme</span>
            </h3>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#3B342B]">Jewelry Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#D9CEBC] bg-white text-xs text-[#1A1715] font-medium focus:outline-none focus:ring-2 focus:ring-[#B38541]/40"
              >
                {JEWELRY_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name} ({cat.placement})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-[#8C7E6C]">
                Adaptive framing automatically adjusts camera distances, model poses, and macro zoom.
              </p>
            </div>

            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#3B342B]">Lighting &amp; Setting Theme</label>
              <div className="space-y-2">
                {THEME_OPTIONS.map((opt) => {
                  const isSelected = theme === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTheme(opt.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3",
                        isSelected
                          ? "border-[#B38541] bg-gradient-to-r from-[#FAF5EC] to-[#F5EBD9] shadow-sm"
                          : "border-[#E8DFC8] bg-[#FDFBF7] hover:bg-[#F9F5EC]"
                      )}
                    >
                      <span className="text-lg shrink-0 mt-0.5">{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-[#1A1715]">{opt.title}</p>
                          <span
                            className={cn(
                              "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                              isSelected
                                ? "bg-[#B38541] text-white"
                                : "bg-[#EDE5D8] text-[#6E6458]"
                            )}
                          >
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7A6F60] mt-0.5 line-clamp-2 leading-relaxed">
                          {opt.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#3B342B]">Campaign Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: "4:5", label: "4:5 Portrait", desc: "Lookbook / IG" },
                    { id: "1:1", label: "1:1 Square", desc: "E-Commerce" },
                    { id: "16:9", label: "16:9 Wide", desc: "Hero Banner" },
                  ] as const
                ).map((ar) => (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => setAspectRatio(ar.id)}
                    className={cn(
                      "p-2.5 rounded-xl border text-center transition-all",
                      aspectRatio === ar.id
                        ? "border-[#B38541] bg-[#FAF5EC] text-[#1A1715] font-bold shadow-sm"
                        : "border-[#E8DFC8] text-[#7A6F60] hover:bg-[#F9F5EC]"
                    )}
                  >
                    <p className="text-xs font-bold">{ar.label}</p>
                    <p className="text-[10px] opacity-75">{ar.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Generation CTA */}
            <div className="pt-2">
              <Button
                type="button"
                disabled={isGenerating || (!selectedFile && !previewUrl)}
                onClick={handleGeneratePhotoshoot}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#1A1715] via-[#2A241F] to-[#1A1715] hover:from-[#2E2823] hover:to-[#221D19] text-[#E8D0AA] font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 border border-[#D9C4A2]/30 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#D8B77E]" />
                    <span>Synthesizing 5-Shot Campaign...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 text-[#D8B77E]" />
                    <span>Generate 5-Image Photoshoot Set</span>
                  </>
                )}
              </Button>
            </div>

            {/* Campaign Output Guarantee List */}
            <div className="pt-1 border-t border-[#F0EBE3] space-y-1.5 text-[11px] text-[#7A6F60]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <span>2 Editorial Human Model Campaign Portraits</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <span>3 Commercial Product &amp; Ultra-Macro Angles</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <span>Zero AI Glitch: Real Skin Pores &amp; Exact Stone Counts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Active State / Progress Bar */}
      {isGenerating && (
        <Card className="border border-[#D9C4A2] bg-gradient-to-br from-[#FCFBF8] to-[#F7F2E7] rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="max-w-xl mx-auto space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1A1715] to-[#342D26] text-[#D8B77E] flex items-center justify-center mx-auto shadow-md border border-[#D9C4A2]/30">
              <Camera className="w-7 h-7 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-[#1A1715]">
                Directing Your Luxury Jewelry Campaign...
              </h3>
              <p className="text-xs text-[#7A6F60]">
                {GENERATION_STAGES[progressStageIndex].label}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#E8DFC8] rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#B38541] via-[#D8B77E] to-[#E8C88C] h-2.5 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${GENERATION_STAGES[progressStageIndex].progress}%`,
                }}
              />
            </div>

            {/* Step badges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
              {[
                "Hero Model",
                "Alternate Model",
                "Product Hero",
                "45° Profile",
                "Macro Detail",
              ].map((name, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-2 rounded-xl text-center text-[10px] font-semibold border transition-all",
                    progressStageIndex >= i + 1
                      ? "bg-[#FAF5EC] border-[#B38541] text-[#8C6428]"
                      : "bg-white/60 border-[#E5DCce] text-[#A39889]"
                  )}
                >
                  <p className="font-bold">Shot {i + 1}</p>
                  <p className="truncate">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Generated Campaign Gallery */}
      {campaignResult && (
        <div className="space-y-6 pt-4 border-t border-[#E8E0D2]">
          {/* Gallery Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#FAF5EC] via-[#F8EFE1] to-[#FAF5EC] border border-[#D9C4A2]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#1A1715]">
                  Photoshoot Campaign Set ({campaignResult.shots.length} Photographs)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/20 text-[#065F46] border border-[#10B981]/30">
                  Ready
                </span>
              </div>
              <p className="text-xs text-[#7A6F60] mt-0.5">
                Category: <strong>{campaignResult.category}</strong> • Lighting Theme:{" "}
                <strong className="capitalize">{campaignResult.theme.replace("-", " ")}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                className="bg-white border-[#D9C4A2] text-xs font-semibold text-[#8C6428] hover:bg-[#FAF5EC]"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download All Photos
              </Button>
            </div>
          </div>

          {/* 5-Shot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaignResult.shots.map((shot: PhotoshootShotResult, index: number) => {
              const isModelShot = shot.type === "hero-model" || shot.type === "alternate-model";
              return (
                <Card
                  key={shot.id}
                  className="group bg-white border border-[#E8DFC8] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  {/* Image Display Area */}
                  <div className="relative aspect-[4/5] bg-[#F7F4EF] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shot.imageUrl}
                      alt={shot.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />

                    {/* Tag badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm",
                          isModelShot
                            ? "bg-[#1A1715]/80 text-[#F0E6D2] border border-[#D9C4A2]/40"
                            : "bg-white/90 text-[#1A1715] border border-white/60"
                        )}
                      >
                        Shot {index + 1}: {isModelShot ? "Model Campaign" : "Product Studio"}
                      </span>
                    </div>

                    {/* Hover actions overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedShotForModal(shot)}
                          className="p-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 text-white transition-colors"
                          title="Zoom In"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadShot(shot)}
                          className="p-2 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 text-white transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSendToVideoStudio(shot)}
                          className="flex-1 bg-[#D8B77E] text-[#1A1715] hover:bg-[#EBD5B3] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                        >
                          <Film className="w-3.5 h-3.5" />
                          <span>AI Runway Video</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Shot Information Footer */}
                  <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-sm font-serif font-bold text-[#1A1715]">
                        {shot.title}
                      </h4>
                      <p className="text-xs text-[#7A6F60] line-clamp-2 mt-1 leading-relaxed">
                        {shot.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#F0EBE3] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedShotForModal(shot)}
                        className="text-xs font-semibold text-[#8C6428] hover:text-[#5E4219] flex items-center gap-1"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Inspect Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadShot(shot)}
                        className="text-xs text-[#7A6F60] hover:text-[#1A1715] flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save WebP</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Fullscreen Shot Inspection & Reference Comparison */}
      {selectedShotForModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedShotForModal(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E8DFC8] max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#F0EBE3] flex items-center justify-between bg-[#FCFBF8]">
              <div>
                <h3 className="text-base font-serif font-bold text-[#1A1715]">
                  {selectedShotForModal.title}
                </h3>
                <p className="text-xs text-[#7A6F60] mt-0.5">
                  {selectedShotForModal.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedShotForModal(null)}
                className="w-8 h-8 rounded-full bg-[#EDE5D8] flex items-center justify-center text-[#5E4219] hover:bg-[#D9C4A2] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Comparison View */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left: Original Uploaded Reference */}
              <div className="space-y-2 text-center">
                <span className="text-xs font-bold text-[#7A6F60] uppercase tracking-wider block">
                  Original Jewelry Reference
                </span>
                <div className="aspect-square bg-[#F7F4EF] rounded-2xl overflow-hidden border border-[#E8DFC8] flex items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={campaignResult?.sourceJewelryUrl || previewUrl || ""}
                    alt="Original Product"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-[11px] text-[#8C7E6C]">
                  Stone count &amp; geometry preserved as absolute source of truth
                </p>
              </div>

              {/* Right: Generated Campaign Shot */}
              <div className="space-y-2 text-center">
                <span className="text-xs font-bold text-[#8C6428] uppercase tracking-wider block">
                  Generated Photoshoot Shot
                </span>
                <div className="aspect-square bg-[#F7F4EF] rounded-2xl overflow-hidden border border-[#D9C4A2] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedShotForModal.imageUrl}
                    alt={selectedShotForModal.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] text-[#10B981] font-semibold flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  DSLR Macro &amp; Natural Human Interaction
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-[#F0EBE3] bg-[#FCFBF8] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#7A6F60]">
                High-Resolution WebP (Commercial Quality)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadShot(selectedShotForModal)}
                  className="text-xs font-semibold border-[#D9C4A2] text-[#8C6428] hover:bg-[#FAF5EC]"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download Shot
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    handleSendToVideoStudio(selectedShotForModal);
                    setSelectedShotForModal(null);
                  }}
                  className="bg-[#1A1715] text-[#D8B77E] hover:bg-[#2A241F] text-xs font-bold rounded-xl"
                >
                  <Film className="w-3.5 h-3.5 mr-1.5" />
                  Render Runway Video
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
