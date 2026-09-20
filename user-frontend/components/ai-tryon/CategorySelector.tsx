"use client";

import * as React from "react";
import { JEWELRY_CATEGORIES } from "../../constants/categories";
import { cn } from "../../lib/utils";
import { Sparkles, PlusCircle, Wand2, User, UserCheck, Info } from "lucide-react";

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  customCategoryName?: string;
  onChangeCustomCategoryName?: (name: string) => void;
  customPlacement?: string;
  onChangeCustomPlacement?: (placement: string) => void;
  disabled?: boolean;
}

type GenderTab = "female" | "male" | "all";

const WOMEN_CUSTOM_PRESETS = [
  { name: "Nath / Nose Ring", placement: "nose & nostril" },
  { name: "Kamarbandh / Waist Chain", placement: "waist & hips" },
  { name: "Bajuband / Armlet", placement: "upper arm & bicep" },
  { name: "Finger Ring", placement: "finger & hand" },
  { name: "Brooch / Pin", placement: "lapel & upper chest" },
  { name: "Tiara / Crown", placement: "top of head & hair" },
];

const MEN_CUSTOM_PRESETS = [
  { name: "Royal Sherwani Brooch", placement: "chest & lapel" },
  { name: "Turban Kalgi / Sarpech", placement: "turban / safa forehead" },
  { name: "Kurta Button Chain Set", placement: "kurta chest placket" },
  { name: "Royal Cufflinks", placement: "shirt cuffs & wrists" },
  { name: "Punjabi Heavy Kada", placement: "wrist" },
  { name: "Signet / Gemstone Ring", placement: "finger & hand" },
];

export function CategorySelector({
  selectedCategory,
  onSelectCategory,
  customCategoryName = "",
  onChangeCustomCategoryName,
  customPlacement = "",
  onChangeCustomPlacement,
  disabled,
}: CategorySelectorProps) {
  // Determine initial gender tab based on selected category
  const selectedCatObj = JEWELRY_CATEGORIES.find((c) => c.id === selectedCategory);
  const [activeGender, setActiveGender] = React.useState<GenderTab>(() => {
    if (selectedCatObj?.gender === "male") return "male";
    return "female";
  });

  const isCustomSelected = selectedCategory === "custom";

  // Filter categories based on active gender tab
  const filteredCategories = React.useMemo(() => {
    if (activeGender === "all") return JEWELRY_CATEGORIES;
    return JEWELRY_CATEGORIES.filter(
      (cat) => cat.gender === activeGender || cat.gender === "unisex"
    );
  }, [activeGender]);

  const handleApplyPreset = (preset: { name: string; placement: string }) => {
    onSelectCategory("custom");
    onChangeCustomCategoryName?.(preset.name);
    onChangeCustomPlacement?.(preset.placement);
  };

  const activePresets =
    activeGender === "male" ? MEN_CUSTOM_PRESETS : WOMEN_CUSTOM_PRESETS;

  return (
    <div className="space-y-3.5">
      {/* Top Header & Gender Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {/* Main Category Label with Tooltip */}
          <div className="group relative inline-flex items-center gap-1.5 cursor-pointer">
            <label className="text-sm font-semibold text-[#1A1715] flex items-center gap-1.5 cursor-pointer">
              <span>Jewelry Category</span>
              <Info className="w-3.5 h-3.5 text-[#8C6428] hover:text-[#B38541] transition-colors" />
            </label>
            {/* Tooltip on main label */}
            <div className="absolute bottom-[calc(100%+8px)] left-0 hidden group-hover:flex flex-col w-64 p-2.5 rounded-xl bg-[#1A1715] text-[#FBF9F5] shadow-xl border border-[#3E3832] z-50 pointer-events-none animate-in fade-in duration-150 text-left">
              <span className="text-xs font-bold text-[#D8B77E] mb-0.5">Anatomical Placement AI</span>
              <p className="text-[11px] leading-snug text-[#D1C7BA]">
                Select the category of your jewelry product. The AI replaces any pre-existing jewelry on the model in this zone and renders the new piece with authentic studio realism.
              </p>
              <div className="absolute top-full left-4 -mt-1 w-2 h-2 rotate-45 bg-[#1A1715] border-r border-b border-[#3E3832]" />
            </div>
          </div>

          {/* Gender Filter Tabs */}
          <div className="flex items-center p-0.5 rounded-xl bg-[#F0EBE3] border border-[#E4DCD0]">
            <button
              type="button"
              disabled={disabled}
              onClick={() => setActiveGender("female")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150",
                activeGender === "female"
                  ? "bg-white text-[#8C6428] shadow-xs"
                  : "text-[#7A736B] hover:text-[#1A1715]"
              )}
            >
              ✨ Women
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => setActiveGender("male")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150",
                activeGender === "male"
                  ? "bg-white text-[#8C6428] shadow-xs"
                  : "text-[#7A736B] hover:text-[#1A1715]"
              )}
            >
              👑 Men
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => setActiveGender("all")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150",
                activeGender === "all"
                  ? "bg-white text-[#8C6428] shadow-xs"
                  : "text-[#7A736B] hover:text-[#1A1715]"
              )}
            >
              All
            </button>
          </div>
        </div>

        <span className="text-xs text-[#8C6428] font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Anatomical Placement AI
        </span>
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {filteredCategories.map((cat, idx) => {
          const isSelected = selectedCategory === cat.id;
          const isEvenCol = idx % 2 === 0;

          return (
            <button
              key={cat.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectCategory(cat.id)}
              title={`${cat.name} (${cat.placement.toUpperCase()}) — ${cat.description}`}
              className={cn(
                "group relative flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:opacity-50 hover:z-30",
                isSelected
                  ? "border-[#B38541] bg-[#FAF5EB] shadow-sm ring-1 ring-[#B38541]/50"
                  : "border-[#E8E1D6] bg-white hover:border-[#D6CCC0] hover:bg-[#FDFBF8]"
              )}
            >
              {/* Floating Luxury Tooltip */}
              <div
                className={cn(
                  "absolute bottom-[calc(100%+8px)] hidden group-hover:flex flex-col w-56 sm:w-64 p-3 rounded-xl bg-[#1A1715] text-[#FBF9F5] shadow-2xl border border-[#3E3832] z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 text-left",
                  isEvenCol
                    ? "left-0 sm:left-1/2 sm:-translate-x-1/2"
                    : "right-0 sm:left-1/2 sm:-translate-x-1/2"
                )}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <span className="text-xs font-bold text-[#D8B77E] truncate">{cat.name}</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#2D2721] text-[#E5C992] border border-[#483E32] shrink-0">
                    {cat.placement}
                  </span>
                </div>
                <p className="text-[11px] leading-snug text-[#D1C7BA]">{cat.description}</p>
                <div className="mt-2 pt-1.5 border-t border-[#2E2822] flex items-center gap-1.5 text-[10px] text-[#A69B8D]">
                  <Sparkles className="w-2.5 h-2.5 text-[#D8B77E] shrink-0" />
                  <span>Auto-replaces pre-existing jewelry</span>
                </div>
                {/* Arrow pointer */}
                <div
                  className={cn(
                    "absolute top-full -mt-1 w-2 h-2 rotate-45 bg-[#1A1715] border-r border-b border-[#3E3832]",
                    isEvenCol
                      ? "left-6 sm:left-1/2 sm:-translate-x-1/2"
                      : "right-6 sm:left-1/2 sm:-translate-x-1/2"
                  )}
                />
              </div>

              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={cn(
                    "text-xs font-semibold tracking-tight truncate pr-1 flex items-center gap-1",
                    isSelected ? "text-[#1A1715]" : "text-[#2E2A25]"
                  )}
                >
                  <span className="truncate">{cat.name}</span>
                  <Info className="w-3 h-3 text-[#A89F91] group-hover:text-[#B38541] transition-colors shrink-0 opacity-70 group-hover:opacity-100" />
                </span>
                <span
                  className={cn(
                    "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded shrink-0",
                    isSelected
                      ? "bg-[#EFE3CF] text-[#7A561E]"
                      : "bg-[#F3EEE7] text-[#7A736B]"
                  )}
                >
                  {cat.placement}
                </span>
              </div>
              <p
                className={cn(
                  "text-[11px] line-clamp-1 leading-snug",
                  isSelected ? "text-[#7A561E]" : "text-[#8A837A]"
                )}
              >
                {cat.description}
              </p>
            </button>
          );
        })}

        {/* Custom Category Card with Tooltip */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectCategory("custom")}
          title="Custom Category: Define any custom jewelry piece and custom anatomical placement"
          className={cn(
            "group relative flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:opacity-50 hover:z-30",
            isCustomSelected
              ? "border-[#B38541] bg-[#FAF5EB] shadow-sm ring-1 ring-[#B38541]/50"
              : "border-dashed border-[#D6CCC0] bg-[#FCFAF7] hover:border-[#B38541] hover:bg-[#FAF6EF]"
          )}
        >
          {/* Floating Tooltip */}
          <div className="absolute bottom-[calc(100%+8px)] right-0 sm:left-1/2 sm:-translate-x-1/2 hidden group-hover:flex flex-col w-56 sm:w-64 p-3 rounded-xl bg-[#1A1715] text-[#FBF9F5] shadow-2xl border border-[#3E3832] z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="flex items-center justify-between gap-1.5 mb-1.5">
              <span className="text-xs font-bold text-[#D8B77E]">Custom Category</span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#2D2721] text-[#E5C992] border border-[#483E32] shrink-0">
                CUSTOM
              </span>
            </div>
            <p className="text-[11px] leading-snug text-[#D1C7BA]">
              Define any unique jewelry piece (e.g. Nath, Kamarbandh, Brooch) and its custom anatomical body placement.
            </p>
            <div className="mt-2 pt-1.5 border-t border-[#2E2822] flex items-center gap-1.5 text-[10px] text-[#A69B8D]">
              <Sparkles className="w-2.5 h-2.5 text-[#D8B77E] shrink-0" />
              <span>Tailored AI placement mapping</span>
            </div>
            <div className="absolute top-full right-6 sm:left-1/2 sm:-translate-x-1/2 -mt-1 w-2 h-2 rotate-45 bg-[#1A1715] border-r border-b border-[#3E3832]" />
          </div>

          <div className="flex items-center justify-between w-full mb-1">
            <span
              className={cn(
                "text-xs font-semibold tracking-tight flex items-center gap-1",
                isCustomSelected ? "text-[#1A1715]" : "text-[#524B43]"
              )}
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#B38541]" />
              <span>Custom Category</span>
              <Info className="w-3 h-3 text-[#A89F91] group-hover:text-[#B38541] transition-colors shrink-0 opacity-70 group-hover:opacity-100" />
            </span>
            <span
              className={cn(
                "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded",
                isCustomSelected
                  ? "bg-[#EFE3CF] text-[#7A561E]"
                  : "bg-[#EFE9E0] text-[#8C6428]"
              )}
            >
              CUSTOM
            </span>
          </div>
          <p
            className={cn(
              "text-[11px] line-clamp-1 leading-snug",
              isCustomSelected ? "text-[#7A561E]" : "text-[#8A837A]"
            )}
          >
            {activeGender === "male"
              ? "Kalgi, Brooch, Buttons, Rings & more"
              : "Nath, Kamarbandh, Bajuband, Rings & more"}
          </p>
        </button>
      </div>

      {/* Expandable Custom Category Details Form */}
      {isCustomSelected && (
        <div className="p-4 rounded-2xl bg-[#FCFAF6] border border-[#EBE3D6] space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1715]">
              <Wand2 className="w-4 h-4 text-[#B38541]" />
              <span>Configure Custom Jewelry &amp; Placement</span>
            </div>
            <span className="text-[11px] text-[#8A8175]">
              AI Neural Adaptor Active
            </span>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[11px] text-[#7A736B] font-medium block mb-1.5">
              Popular Presets for {activeGender === "male" ? "Men" : "Women"} (Click to fill):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activePresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  title={`Target body placement: ${preset.placement}`}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#F2EDE4] hover:bg-[#E8DFC9] text-[#2C2723] transition-colors border border-[#E2DAD0]"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <div className="group relative inline-flex items-center gap-1 cursor-pointer">
                <label className="text-xs font-medium text-[#524B43] flex items-center gap-1 cursor-pointer">
                  <span>Custom Category Name</span>
                  <Info className="w-3 h-3 text-[#A89F91] hover:text-[#B38541] transition-colors" />
                </label>
                {/* Floating Tooltip */}
                <div className="absolute bottom-[calc(100%+6px)] left-0 hidden group-hover:flex flex-col w-56 p-2 rounded-xl bg-[#1A1715] text-[#FBF9F5] shadow-xl border border-[#3E3832] z-50 pointer-events-none text-left">
                  <span className="text-[11px] font-bold text-[#D8B77E]">Category Name</span>
                  <p className="text-[10px] text-[#D1C7BA] leading-tight">
                    Type of jewelry piece to wear, e.g. Nath, Brooch, Kamarbandh, or Ring.
                  </p>
                  <div className="absolute top-full left-4 -mt-1 w-2 h-2 rotate-45 bg-[#1A1715] border-r border-b border-[#3E3832]" />
                </div>
              </div>
              <input
                type="text"
                value={customCategoryName}
                onChange={(e) => onChangeCustomCategoryName?.(e.target.value)}
                placeholder={
                  activeGender === "male"
                    ? "e.g. Royal Brooch, Kalgi, Cufflinks"
                    : "e.g. Nath / Nose Ring, Kamarbandh, Brooch"
                }
                className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[#DFD7CC] bg-white text-[#1A1715] placeholder:text-[#A69E94] focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-[#C89E58]"
              />
            </div>

            <div className="space-y-1">
              <div className="group relative inline-flex items-center gap-1 cursor-pointer">
                <label className="text-xs font-medium text-[#524B43] flex items-center gap-1 cursor-pointer">
                  <span>Placement Target on Body</span>
                  <Info className="w-3 h-3 text-[#A89F91] hover:text-[#B38541] transition-colors" />
                </label>
                {/* Floating Tooltip */}
                <div className="absolute bottom-[calc(100%+6px)] left-0 hidden group-hover:flex flex-col w-56 p-2 rounded-xl bg-[#1A1715] text-[#FBF9F5] shadow-xl border border-[#3E3832] z-50 pointer-events-none text-left">
                  <span className="text-[11px] font-bold text-[#D8B77E]">Target Anatomy</span>
                  <p className="text-[10px] text-[#D1C7BA] leading-tight">
                    Specific anatomical zone on the model where this jewelry should be positioned.
                  </p>
                  <div className="absolute top-full left-4 -mt-1 w-2 h-2 rotate-45 bg-[#1A1715] border-r border-b border-[#3E3832]" />
                </div>
              </div>
              <input
                type="text"
                value={customPlacement}
                onChange={(e) => onChangeCustomPlacement?.(e.target.value)}
                placeholder={
                  activeGender === "male"
                    ? "e.g. turban, lapel, cuffs, wrist, finger"
                    : "e.g. nose, waist, upper arm, fingers, lapel"
                }
                className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-[#DFD7CC] bg-white text-[#1A1715] placeholder:text-[#A69E94] focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-[#C89E58]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
