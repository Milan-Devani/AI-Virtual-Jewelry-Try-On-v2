"use client";

import * as React from "react";
import { Modal } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Film,
  Play,
  Sparkles,
  ShieldCheck,
  Tag,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { cn } from "../../lib/utils";
import {
  REAL_VIDEO_PROJECTS,
  VideoProject,
} from "../../constants/sample-video-projects";

interface VideoProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: VideoProject) => void;
  onCloneToStudio: (project: VideoProject) => void;
}

export function VideoProjectsModal({
  isOpen,
  onClose,
  onSelectProject,
  onCloneToStudio,
}: VideoProjectsModalProps) {
  const [selectedFilter, setSelectedFilter] = React.useState<string>("all");

  const categories = [
    { id: "all", label: "All Campaigns" },
    { id: "necklaces-pendants", label: "Necklaces & Haar" },
    { id: "jhumkas", label: "Jhumkas & Earrings" },
    { id: "rings", label: "Rings" },
    { id: "haath-phool", label: "Haath Phool" },
    { id: "maang-tikka", label: "Maang Tikka" },
    { id: "mens-groom-mala", label: "Men's Luxury" },
  ];

  const filteredProjects =
    selectedFilter === "all"
      ? REAL_VIDEO_PROJECTS
      : REAL_VIDEO_PROJECTS.filter((p) => p.category === selectedFilter);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Real Luxury Jewelry Campaign Video Projects"
      description="Browse production-grade fashion campaign motion videos generated with 100% exact jewelry preservation, diverse model personas, and 35mm optical choreography."
      maxWidth="6xl"
    >
      <div className="space-y-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#EAE3D8] modal-scrollbar">
          <Filter className="w-3.5 h-3.5 text-[#B38541] shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedFilter(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all",
                selectedFilter === cat.id
                  ? "bg-[#1A1715] text-white shadow-xs"
                  : "bg-[#F7F3EB] text-[#7A6E61] hover:bg-[#EFE7D8] hover:text-[#1A1715]"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-[#E8DFD3] bg-[#FCFAF8] hover:bg-white hover:border-[#B38541] transition-all p-3.5 flex flex-col justify-between space-y-3 group shadow-xs hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Media Preview Thumbnail / Video Hook */}
                <div
                  onClick={() => {
                    onSelectProject(project);
                  }}
                  className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 cursor-pointer group/thumb border border-[#E2D6C5]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md text-[#D8B77E] border border-white/20 flex items-center justify-center group-hover/thumb:scale-110 group-hover/thumb:bg-[#B38541] group-hover/thumb:text-white transition-all shadow-lg">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20">
                      {project.aspectRatio}
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#ECFDF5]/90 text-[#065F46] border border-[#A7F3D0]">
                      {project.durationSeconds}s Video
                    </span>
                  </div>

                  {/* Bottom Persona Details */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <p className="text-[10px] text-white/70 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#D8B77E]" />
                      <span>{project.modelPersona.name}</span>
                    </p>
                    <p className="text-xs font-bold leading-tight line-clamp-1">
                      {project.modelPersona.badge}
                    </p>
                  </div>
                </div>

                {/* Info Text */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#8C6428] px-1.5 py-0.2 rounded bg-[#FAF0DC]">
                      {project.categoryName}
                    </span>
                    <span className="text-[10px] text-[#A69785]">60 FPS</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1A1715] leading-snug line-clamp-2">
                    {project.title}
                  </h4>
                  <p className="text-[11px] text-[#7A6E61] line-clamp-2">
                    {project.modelPersona.attire}
                  </p>
                </div>

                {/* Key Highlights */}
                <div className="space-y-1 pt-1">
                  {project.highlights.slice(0, 2).map((h, i) => (
                    <p
                      key={i}
                      className="text-[10px] text-[#5C5347] flex items-center gap-1 line-clamp-1"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Card Actions */}
              <div className="pt-2 border-t border-[#EAE3D8] flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectProject(project)}
                  className="flex-1 text-[11px] font-bold border-[#D8C7B0] text-[#1A1715] hover:bg-[#FAF6EE] flex items-center justify-center gap-1"
                >
                  <Film className="w-3 h-3 text-[#B38541]" />
                  <span>Watch Video</span>
                </Button>

                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    onCloneToStudio(project);
                    onClose();
                  }}
                  className="text-[11px] font-bold flex items-center justify-center gap-1 px-3"
                  title="Load jewelry and model into Video Studio"
                >
                  <span>Use Piece</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
