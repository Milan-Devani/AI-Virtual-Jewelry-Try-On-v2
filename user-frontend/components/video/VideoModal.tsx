"use client";

import * as React from "react";
import { Modal } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  ExternalLink,
  Maximize2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Film,
  Camera,
  Layers,
  Wand2,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { VideoProject } from "../../constants/sample-video-projects";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VideoProject | null;
  onUseInStudio?: (project: VideoProject) => void;
}

export function VideoModal({
  isOpen,
  onClose,
  project,
  onUseInStudio,
}: VideoModalProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Playback States
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [playbackRate, setPlaybackRate] = React.useState(1);
  const [isLooping, setIsLooping] = React.useState(true);
  const [copiedPrompt, setCopiedPrompt] = React.useState(false);

  // View Modes: "video" | "compare" | "prompt"
  const [activeTab, setActiveTab] = React.useState<"video" | "compare" | "prompt">("video");

  // Reset playback state when modal opens with new project
  React.useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setCurrentTime(0);
      setActiveTab("video");
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [isOpen, project]);

  if (!project) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || project.durationSeconds || 15);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    toast.info(`Playback speed set to ${rate}x`);
  };

  const handleDownload = async () => {
    try {
      toast.info("Starting 1080p MP4 download...");
      const res = await fetch(project.videoUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.id}-campaign.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("1080p Campaign Video downloaded successfully!");
    } catch {
      window.open(project.videoUrl, "_blank");
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(project.prompt);
    setCopiedPrompt(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: project.title,
          text: `Check out this photorealistic luxury jewelry campaign video for ${project.categoryName}!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Campaign link copied to clipboard!");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.title}
      description={project.subtitle}
      maxWidth="5xl"
    >
      <div className="space-y-4">
        {/* Navigation Tabs Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE3D8] pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-[#F4EFE6] rounded-xl border border-[#E4D7C5]">
            <button
              type="button"
              onClick={() => setActiveTab("video")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                activeTab === "video"
                  ? "bg-white text-[#1A1715] shadow-xs"
                  : "text-[#7A6E61] hover:text-[#1A1715]"
              )}
            >
              <Film className="w-3.5 h-3.5 text-[#B38541]" />
              <span>1080p Video Player</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("compare")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                activeTab === "compare"
                  ? "bg-white text-[#1A1715] shadow-xs"
                  : "text-[#7A6E61] hover:text-[#1A1715]"
              )}
            >
              <Layers className="w-3.5 h-3.5 text-[#B38541]" />
              <span>Side-by-Side Product Match</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("prompt")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                activeTab === "prompt"
                  ? "bg-white text-[#1A1715] shadow-xs"
                  : "text-[#7A6E61] hover:text-[#1A1715]"
              )}
            >
              <Wand2 className="w-3.5 h-3.5 text-[#B38541]" />
              <span>Prompt &amp; Camera Optics</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FAF0DC] text-[#8C6428] border border-[#E6D4B8]">
              {project.aspectRatio} • {project.durationSeconds}s
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
              60 FPS 1080P
            </span>
          </div>
        </div>

        {/* Tab 1: Video Player & Controls */}
        {activeTab === "video" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Video Player Box (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black rounded-2xl p-4 border border-[#2D2823] shadow-xl relative overflow-hidden">
              <div
                className={cn(
                  "relative w-full max-w-sm rounded-xl overflow-hidden bg-neutral-950 border border-white/10 shadow-2xl group",
                  project.aspectRatio === "9:16" && "aspect-[9/16]",
                  project.aspectRatio === "4:5" && "aspect-[4/5]",
                  project.aspectRatio === "16:9" && "aspect-[16/9]"
                )}
              >
                <video
                  ref={videoRef}
                  src={project.videoUrl}
                  autoPlay
                  loop={isLooping}
                  muted={isMuted}
                  playsInline
                  crossOrigin="anonymous"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={togglePlay}
                />

                {/* Big Center Play/Pause Overlay */}
                {!isPlaying && (
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer animate-in fade-in"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#D8B77E] text-[#1A1715] flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </div>
                  </div>
                )}

                {/* Video Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Preview
                  </span>
                </div>
              </div>

              {/* Media Control Bar */}
              <div className="w-full max-w-sm mt-3 pt-3 border-t border-white/10 text-white space-y-2">
                {/* Scrubber Slider */}
                <div className="flex items-center gap-2 text-[10px] font-mono text-white/70">
                  <span>{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || project.durationSeconds || 15}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#D8B77E]"
                  />
                  <span>{formatTime(duration || project.durationSeconds || 15)}</span>
                </div>

                {/* Button Controls */}
                <div className="flex items-center justify-between text-white/90">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLooping(!isLooping)}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1",
                        isLooping ? "text-[#D8B77E] bg-white/10" : "text-white/60 hover:bg-white/10"
                      )}
                      title="Toggle Loop"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Loop</span>
                    </button>
                  </div>

                  {/* Speed Picker */}
                  <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5 text-[10px]">
                    {[0.75, 1, 1.25].map((speed) => (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => changeSpeed(speed)}
                        className={cn(
                          "px-1.5 py-0.5 rounded transition-all",
                          playbackRate === speed
                            ? "bg-[#D8B77E] text-[#1A1715] font-bold"
                            : "text-white/70 hover:text-white"
                        )}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Specifications & Details (5 cols) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3.5">
                {/* Model Persona Badge Card */}
                <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E8DAC5] flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.modelPersona.avatarUrl}
                    alt={project.modelPersona.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#D5C1A5] shadow-xs shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-[#1A1715] truncate">
                        {project.modelPersona.name}
                      </h4>
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EADCC7] text-[#7A551E]">
                        {project.modelPersona.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#756A5C] line-clamp-1 mt-0.5">
                      {project.modelPersona.attire}
                    </p>
                    <p className="text-[10px] text-[#A39686] mt-0.5">
                      Tone: {project.modelPersona.skinTone}
                    </p>
                  </div>
                </div>

                {/* Campaign Technical Highlights */}
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#1A1715] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B38541]" />
                    <span>Runway Campaign Directives</span>
                  </h5>
                  <div className="space-y-1.5">
                    {project.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-[#FCFAF7] border border-[#EFE8DC] text-[11px] text-[#4A4237] flex items-start gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metadata Badges */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
                    <p className="text-[10px] text-[#8C7D6E]">Motion Choreography</p>
                    <p className="font-bold text-[#1A1715] capitalize mt-0.5">
                      {project.motionStyle.replace("-", " ")}
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
                    <p className="text-[10px] text-[#8C7D6E]">Optics &amp; Lens</p>
                    <p className="font-bold text-[#1A1715] mt-0.5">35mm Shallow DoF</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#EAE3D8]">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleDownload}
                    className="w-full bg-[#1A1715] hover:bg-[#2A2622] text-[#FBF9F5] flex items-center justify-center gap-1.5 text-xs font-bold"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D8B77E]" />
                    <span>Download 1080p MP4</span>
                  </Button>

                  {onUseInStudio && (
                    <Button
                      type="button"
                      variant="gold"
                      size="md"
                      onClick={() => {
                        onUseInStudio(project);
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-bold"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Clone to Studio</span>
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-[#7A6E61]">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-1 hover:text-[#1A1715] font-semibold"
                  >
                    <Share2 className="w-3 h-3 text-[#B38541]" />
                    <span>Share Campaign</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.open(project.videoUrl, "_blank")}
                    className="flex items-center gap-1 hover:text-[#1A1715] font-semibold"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open in New Tab</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Side-by-Side Product Match & Fidelity */}
        {activeTab === "compare" && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#FAF5EB] border border-[#E6DAC5] text-xs text-[#7A5F2C] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B38541] shrink-0" />
              <span>
                <strong>100% Product Fidelity Guarantee:</strong> The jewelry worn by the human fashion model preserves every gemstone count, setting, metal hue, and facet of the source product image.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Source Product Photo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1A1715]">
                    1. Exact Reference Product
                  </span>
                  <span className="text-[10px] text-[#8C7A68]">100% Source of Truth</span>
                </div>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F7F4EF] border-2 border-[#D8C7B0] shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.sourceJewelryUrl}
                    alt="Source jewelry piece"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold">
                    {project.categoryName}
                  </div>
                </div>
              </div>

              {/* Right: Video Motion Render */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1A1715]">
                    2. Model Worn Runway Motion
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">Live 60 FPS Render</span>
                </div>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black border-2 border-[#D8B77E] shadow-sm">
                  <video
                    src={project.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#D8B77E] text-[10px] font-bold">
                    {project.modelPersona.name} ({project.durationSeconds}s)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Prompt & Camera Optics */}
        {activeTab === "prompt" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1715]">
                  Master Luxury Fashion Video Campaign Prompt
                </h4>
                <p className="text-[11px] text-[#7A6E61]">
                  Full structured instruction executed by the AI Diffusion engine for this campaign.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 text-xs font-semibold border-[#D8C7B0]"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? "Copied!" : "Copy Full Prompt"}</span>
              </Button>
            </div>

            <div className="p-4 rounded-2xl bg-[#FCFAF7] border border-[#E8DFD3] space-y-3 font-mono text-xs text-[#2A241E] whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed modal-scrollbar">
              {project.prompt}
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF4EA] border border-[#E6D4B8] space-y-1 text-xs text-[#7A5F2C]">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B38541]" />
                <span>Strict Anti-AI Negative Prompt Filters Enforced:</span>
              </div>
              <p className="text-[11px] text-[#8C713D] leading-relaxed font-mono">
                Avoid: AI-looking faces, plastic skin, wax skin, distorted hands, extra fingers, missing fingers, deformed body, unnatural walking, floating jewelry, detached jewelry, duplicated jewelry, changing jewelry design, incorrect jewelry placement, melted gemstones, distorted metal, fake reflections, excessive glow, CGI appearance, cartoon style, animation style, unrealistic camera movement, flickering, frame-to-frame product changes.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
