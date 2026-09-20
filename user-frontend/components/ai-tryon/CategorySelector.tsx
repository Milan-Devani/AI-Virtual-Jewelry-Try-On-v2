"use client";

import * as React from "react";
import { JEWELRY_CATEGORIES } from "../../constants/categories";
import { cn } from "../../lib/utils";
import {
  Sparkles,
  PlusCircle,
  Wand2,
  Info,
  Layers,
  Plus,
  Trash2,
  Check,
  Edit3,
  ChevronDown,
} from "lucide-react";
import { Modal } from "../ui/dialog";

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

export interface SingleJewelryItem {
  id: string;
  name: string;
  shortName: string;
  placement: string;
  group: string;
}

export const SINGLE_JEWELRY_ITEMS: SingleJewelryItem[] = [
  // --- Ears & Face ---
  { id: "jhumkas", name: "Jhumkas (Bell Earrings)", shortName: "Jhumkas", placement: "ears", group: "Ears & Face" },
  { id: "earrings", name: "Earrings / Studs / Drops", shortName: "Earrings", placement: "ears", group: "Ears & Face" },
  { id: "mens-studs", name: "Men's Diamond Studs / Bali", shortName: "Men's Studs", placement: "ears", group: "Ears & Face" },
  { id: "nath", name: "Nath / Bridal Nose Ring", shortName: "Nath", placement: "nose & nostril", group: "Ears & Face" },
  { id: "maang-tikka", name: "Maang Tikka / Matha Patti", shortName: "Maang Tikka", placement: "forehead", group: "Ears & Face" },

  // --- Neck & Chest ---
  { id: "necklaces", name: "Necklace / Choker / Haar", shortName: "Necklace", placement: "neck", group: "Neck & Chest" },
  { id: "mangalsutra", name: "Mangalsutra (Sacred Chain)", shortName: "Mangalsutra", placement: "neck", group: "Neck & Chest" },
  { id: "pendants", name: "Pendant / Locket Chain", shortName: "Pendant", placement: "neck", group: "Neck & Chest" },
  { id: "mens-chains", name: "Men's Curb Link / Gold Chain", shortName: "Men's Chain", placement: "neck & chest", group: "Neck & Chest" },
  { id: "groom-mala", name: "Groom Royal Pearl / Emerald Mala", shortName: "Groom Mala", placement: "neck & chest", group: "Neck & Chest" },
  { id: "sherwani-brooch", name: "Royal Sherwani Brooch", shortName: "Sherwani Brooch", placement: "lapel & chest", group: "Neck & Chest" },
  { id: "brooch", name: "Brooch / Lapel Pin", shortName: "Brooch", placement: "lapel & chest", group: "Neck & Chest" },
  { id: "kurta-buttons", name: "Chained Kurta Button Set", shortName: "Kurta Buttons", placement: "kurta chest placket", group: "Neck & Chest" },

  // --- Wrists, Arms & Hands ---
  { id: "bangles-bracelets", name: "Bangles / Tennis Bracelet", shortName: "Bangles & Bracelets", placement: "wrist", group: "Wrists & Hands" },
  { id: "haath-phool", name: "Haath Phool (Hand Harness)", shortName: "Haath Phool", placement: "hand & fingers", group: "Wrists & Hands" },
  { id: "finger-ring", name: "Women's Solitaire / Gold Ring", shortName: "Finger Ring", placement: "fingers", group: "Wrists & Hands" },
  { id: "mens-kada", name: "Men's Heavy Punjabi Kada", shortName: "Men's Kada", placement: "wrist", group: "Wrists & Hands" },
  { id: "mens-ring", name: "Men's Gemstone / Signet Ring", shortName: "Men's Ring", placement: "finger & hand", group: "Wrists & Hands" },
  { id: "cufflinks", name: "Luxury French Cufflinks", shortName: "Cufflinks", placement: "shirt cuffs & wrists", group: "Wrists & Hands" },
  { id: "bajuband", name: "Bajuband / Armlet", shortName: "Bajuband", placement: "upper arm & bicep", group: "Wrists & Hands" },

  // --- Head, Waist & Feet ---
  { id: "turban-kalgi", name: "Turban Kalgi / Safa Sarpech", shortName: "Turban Kalgi", placement: "turban / safa forehead", group: "Head & Turban" },
  { id: "tiara", name: "Tiara / Royal Crown", shortName: "Tiara", placement: "top of head & hair", group: "Head & Turban" },
  { id: "kamarbandh", name: "Kamarbandh / Waist Chain", shortName: "Kamarbandh", placement: "waist & hips", group: "Waist & Feet" },
  { id: "payal", name: "Payal / Ghungroo Anklets", shortName: "Payal / Anklets", placement: "ankles", group: "Waist & Feet" },
  { id: "toe-rings", name: "Bichhiya / Traditional Toe Rings", shortName: "Toe Rings", placement: "toes & feet", group: "Waist & Feet" },
];

const ITEM_GROUPS = [
  "Ears & Face",
  "Neck & Chest",
  "Wrists & Hands",
  "Head & Turban",
  "Waist & Feet",
];

const POPULAR_PAIR_PRESETS = [
  { name: "Jhumka + Anklet", itemIds: ["jhumkas", "payal"] },
  { name: "Necklace + Earrings", itemIds: ["necklaces", "earrings"] },
  { name: "Mangalsutra + Bangles", itemIds: ["mangalsutra", "bangles-bracelets"] },
  { name: "Maang Tikka + Nath", itemIds: ["maang-tikka", "nath"] },
  { name: "Sherwani Brooch + Kalgi", itemIds: ["sherwani-brooch", "turban-kalgi"] },
  { name: "Kada + Signet Ring", itemIds: ["mens-kada", "mens-ring"] },
];

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

interface JewelryItemSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function JewelryItemSelect({ value, onChange, disabled }: JewelryItemSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedItem =
    SINGLE_JEWELRY_ITEMS.find((i) => i.id === value) || SINGLE_JEWELRY_ITEMS[0];

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative flex-1 min-w-0" ref={containerRef}>
      {/* Luxury Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full h-10 px-3 flex items-center justify-between text-left rounded-xl border bg-white transition-all duration-150 outline-none shadow-xs group",
          isOpen
            ? "border-[#B38541] ring-2 ring-[#B38541]/20 bg-[#FAF8F4]"
            : "border-[#DFD7CC] hover:border-[#B38541] hover:bg-[#FDFCFB]"
        )}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          <span className="text-xs font-bold text-[#1A1715] truncate">
            {selectedItem.name}
          </span>
        </div>

        <ChevronDown
          className={cn(
            "w-4 h-4 text-[#8C6428] shrink-0 transition-transform duration-200",
            isOpen && "transform rotate-180 text-[#B38541]"
          )}
        />
      </button>

      {/* Luxury Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 sm:left-0 sm:w-[360px] max-w-[95vw] mt-1.5 py-1.5 bg-[#FFFEFD] border border-[#DFC9A8] rounded-2xl shadow-2xl shadow-stone-900/15 max-h-64 overflow-y-auto z-50 animate-in fade-in-0 zoom-in-95 duration-150 ring-1 ring-black/5 overscroll-contain"
        >
          {ITEM_GROUPS.map((groupName) => {
            const groupItems = SINGLE_JEWELRY_ITEMS.filter((item) => item.group === groupName);
            if (groupItems.length === 0) return null;

            return (
              <div key={groupName} className="mb-1.5 last:mb-0">
                <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8C6428] bg-[#FAF5EB] border-y border-[#F3EAD9]/80 flex items-center gap-1.5">
                  <Sparkles className="w-2.5 h-2.5 text-[#B38541]" />
                  <span>{groupName}</span>
                </div>

                <div className="px-1.5 pt-1 space-y-0.5">
                  {groupItems.map((item) => {
                    const isSelected = item.id === value;

                    return (
                      <div
                        key={item.id}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onChange(item.id);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all duration-100",
                          isSelected
                            ? "bg-[#FAF5EB] text-[#8C6428] font-bold border border-[#E9DFC8]"
                            : "text-[#2C2723] hover:bg-[#F7F2EB] hover:text-[#1A1715]"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="truncate">{item.name}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={cn(
                              "text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded",
                              isSelected
                                ? "bg-[#EFE3CF] text-[#7A561E]"
                                : "bg-[#F0EBE3] text-[#7A736B]"
                            )}
                          >
                            {item.placement}
                          </span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-[#8C6428] shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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

  const isCustomSingleSelected = selectedCategory === "custom";
  const isCustomComboSelected = selectedCategory === "custom-combo";

  // Pair Builder Modal State
  const [isPairModalOpen, setIsPairModalOpen] = React.useState(false);
  const [pairItemIds, setPairItemIds] = React.useState<string[]>(["jhumkas", "payal"]);

  // Filter categories based on active gender tab
  const filteredCategories = React.useMemo(() => {
    if (activeGender === "all") return JEWELRY_CATEGORIES;
    return JEWELRY_CATEGORIES.filter(
      (cat) => cat.gender === activeGender || cat.gender === "unisex"
    );
  }, [activeGender]);

  const handleApplySinglePreset = (preset: { name: string; placement: string }) => {
    onSelectCategory("custom");
    onChangeCustomCategoryName?.(preset.name);
    onChangeCustomPlacement?.(preset.placement);
  };

  const handleApplyPairModal = () => {
    const selectedItems = pairItemIds
      .map((id) => SINGLE_JEWELRY_ITEMS.find((item) => item.id === id))
      .filter((item): item is SingleJewelryItem => Boolean(item));

    const combinedName = selectedItems.map((i) => i.shortName).join(" + ");
    const uniquePlacements = Array.from(
      new Set(selectedItems.map((i) => i.placement))
    ).join(", ");

    onSelectCategory("custom-combo");
    onChangeCustomCategoryName?.(combinedName);
    onChangeCustomPlacement?.(uniquePlacements);
    setIsPairModalOpen(false);
  };

  const handleAddDropdown = () => {
    // Pick an item not yet selected, or default to first
    const unselected = SINGLE_JEWELRY_ITEMS.find((i) => !pairItemIds.includes(i.id));
    const nextId = unselected ? unselected.id : SINGLE_JEWELRY_ITEMS[0].id;
    setPairItemIds((prev) => [...prev, nextId]);
  };

  const handleUpdateDropdownItem = (index: number, newId: string) => {
    setPairItemIds((prev) => {
      const copy = [...prev];
      copy[index] = newId;
      return copy;
    });
  };

  const handleRemoveDropdown = (index: number) => {
    if (pairItemIds.length <= 1) return;
    setPairItemIds((prev) => prev.filter((_, i) => i !== index));
  };

  const activePresets =
    activeGender === "male" ? MEN_CUSTOM_PRESETS : WOMEN_CUSTOM_PRESETS;

  // Selected pair preview computation
  const currentPairObjects = pairItemIds
    .map((id) => SINGLE_JEWELRY_ITEMS.find((item) => item.id === id))
    .filter((item): item is SingleJewelryItem => Boolean(item));
  const currentPairName = currentPairObjects.map((i) => i.shortName).join(" + ");
  const currentPairPlacements = Array.from(
    new Set(currentPairObjects.map((i) => i.placement))
  ).join(", ");

  return (
    <div className="space-y-3.5">
      {/* Top Header & Gender Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
          {/* Main Category Label with Tooltip */}
          <div className="group relative inline-flex items-center gap-1.5 cursor-pointer">
            <label className="text-sm sm:text-base font-bold text-[#1A1715] flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
              <span>Jewelry Category</span>
              <Info className="w-3.5 h-3.5 text-[#8C6428] hover:text-[#B38541] transition-colors" />
            </label>
            {/* Tooltip on main label */}
            <div className="absolute bottom-[calc(100%+8px)] left-0 hidden group-hover:flex flex-col w-64 p-3 rounded-xl bg-[#1A1715] text-[#FBF9F5] shadow-xl border border-[#3E3832] z-50 pointer-events-none animate-in fade-in duration-150 text-left">
              <span className="text-xs font-bold text-[#D8B77E] mb-1">Jewelry Category AI</span>
              <p className="text-[11px] leading-snug text-[#D1C7BA]">
                Select the target category or custom pair. The AI automatically detects and cleanly erases any pre-existing jewelry in this zone on the model, seamlessly fitting your new product.
              </p>
              <div className="absolute top-full left-4 -mt-1 w-2 h-2 rotate-45 bg-[#1A1715] border-r border-b border-[#3E3832]" />
            </div>
          </div>

          <span className="hidden sm:inline-flex text-xs text-[#8C6428] font-medium items-center gap-1 bg-[#FAF5EB] px-2.5 py-0.5 rounded-full border border-[#EADBBE]">
            <Sparkles className="w-3 h-3 text-[#B38541]" />
            <span>Anatomical AI</span>
          </span>
        </div>

        {/* Gender Filter Tabs */}
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto p-0.5 rounded-xl bg-[#F0EBE3] border border-[#E4DCD0]">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setActiveGender("female")}
            className={cn(
              "flex-1 sm:flex-initial px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 text-center",
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
              "flex-1 sm:flex-initial px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 text-center",
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
              "flex-1 sm:flex-initial px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 text-center",
              activeGender === "all"
                ? "bg-white text-[#8C6428] shadow-xs"
                : "text-[#7A736B] hover:text-[#1A1715]"
            )}
          >
            All
          </button>
        </div>
      </div>

      {/* Grid of categories with mobile-first readability */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
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
                "group relative flex flex-col justify-between items-start p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:opacity-50 hover:z-30 min-h-[105px] sm:min-h-[115px] w-full",
                isSelected
                  ? "border-[#B38541] bg-[#FAF5EB] shadow-sm ring-1 ring-[#B38541]/60"
                  : "border-[#E8E1D6] bg-white hover:border-[#D6CCC0] hover:bg-[#FDFBF8]"
              )}
            >
              {/* Floating Luxury Tooltip (Desktop Hover) */}
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

              {/* Card Header & Title Area: full-width so title never truncates */}
              <div className="w-full">
                <div className="flex items-start justify-between gap-1 w-full mb-1">
                  <span
                    className={cn(
                      "text-xs sm:text-xs font-bold tracking-tight leading-snug break-words",
                      isSelected ? "text-[#1A1715]" : "text-[#24201C]"
                    )}
                  >
                    {cat.name}
                  </span>
                  <Info
                    className={cn(
                      "w-3 h-3 transition-colors shrink-0 mt-0.5",
                      isSelected
                        ? "text-[#B38541]"
                        : "text-[#9E9589] group-hover:text-[#B38541]"
                    )}
                  />
                </div>

                {/* Placement Badge placed on its own row to avoid horizontal squishing */}
                <div className="mb-1.5">
                  <span
                    className={cn(
                      "inline-block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md",
                      isSelected
                        ? "bg-[#EFE3CF] text-[#7A561E] border border-[#DFC9A8]"
                        : "bg-[#F3EEE7] text-[#6E675F] border border-[#E9E2D7]"
                    )}
                  >
                    {cat.placement}
                  </span>
                </div>
              </div>

              {/* Description (2 lines allowed on mobile for effortless reading) */}
              <p
                className={cn(
                  "text-[10px] sm:text-[11px] line-clamp-2 leading-snug mt-auto",
                  isSelected ? "text-[#7A561E]" : "text-[#7A736B]"
                )}
              >
                {cat.description}
              </p>
            </button>
          );
        })}

        {/* 1. Custom Single Category Card */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelectCategory("custom")}
          title="Custom Category: Define any custom jewelry piece and custom anatomical placement"
          className={cn(
            "group relative flex flex-col justify-between items-start p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:opacity-50 hover:z-30 min-h-[105px] sm:min-h-[115px] w-full",
            isCustomSingleSelected
              ? "border-[#B38541] bg-[#FAF5EB] shadow-sm ring-1 ring-[#B38541]/60"
              : "border-dashed border-[#D6CCC0] bg-[#FCFAF7] hover:border-[#B38541] hover:bg-[#FAF6EF]"
          )}
        >
          {/* Floating Tooltip */}
          <div className="absolute bottom-[calc(100%+8px)] left-0 sm:left-1/2 sm:-translate-x-1/2 hidden group-hover:flex flex-col w-56 sm:w-64 p-3 rounded-xl bg-[#1A1715] text-[#FBF9F5] shadow-2xl border border-[#3E3832] z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="flex items-center justify-between gap-1.5 mb-1.5">
              <span className="text-xs font-bold text-[#D8B77E]">Custom Single Item</span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#2D2721] text-[#E5C992] border border-[#483E32] shrink-0">
                CUSTOM
              </span>
            </div>
            <p className="text-[11px] leading-snug text-[#D1C7BA]">
              Define any unique single jewelry piece (e.g. Nath, Kamarbandh, Brooch) and its custom anatomical body placement.
            </p>
            <div className="mt-2 pt-1.5 border-t border-[#2E2822] flex items-center gap-1.5 text-[10px] text-[#A69B8D]">
              <Sparkles className="w-2.5 h-2.5 text-[#D8B77E] shrink-0" />
              <span>Tailored single piece placement</span>
            </div>
            <div className="absolute top-full left-6 sm:left-1/2 sm:-translate-x-1/2 -mt-1 w-2 h-2 rotate-45 bg-[#1A1715] border-r border-b border-[#3E3832]" />
          </div>

          <div className="w-full">
            <div className="flex items-start justify-between gap-1 w-full mb-1">
              <span
                className={cn(
                  "text-xs sm:text-xs font-bold tracking-tight flex items-center gap-1",
                  isCustomSingleSelected ? "text-[#1A1715]" : "text-[#4A3F33]"
                )}
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#B38541] shrink-0" />
                <span>Custom Category</span>
              </span>
              <Info className="w-3 h-3 text-[#9E9589] group-hover:text-[#B38541] shrink-0 mt-0.5" />
            </div>

            <div className="mb-1.5">
              <span
                className={cn(
                  "inline-block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md",
                  isCustomSingleSelected
                    ? "bg-[#EFE3CF] text-[#7A561E] border border-[#DFC9A8]"
                    : "bg-[#EFE9E0] text-[#8C6428] border border-[#E3D8C8]"
                )}
              >
                SINGLE PIECE
              </span>
            </div>
          </div>

          <p
            className={cn(
              "text-[10px] sm:text-[11px] line-clamp-2 leading-snug mt-auto",
              isCustomSingleSelected ? "text-[#7A561E]" : "text-[#7A736B]"
            )}
          >
            {activeGender === "male"
              ? "Kalgi, Brooch, Buttons, Rings & more"
              : "Nath, Kamarbandh, Bajuband, Rings & more"}
          </p>
        </button>

        {/* 2. Custom Combo / Multi-Item Pair Card (Opens Modal) */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            onSelectCategory("custom-combo");
            setIsPairModalOpen(true);
          }}
          title="Custom Pair / Combo Builder: Select multiple single jewelry items (e.g. Jhumka + Anklet)"
          className={cn(
            "group relative flex flex-col justify-between items-start p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:opacity-50 hover:z-30 min-h-[105px] sm:min-h-[115px] w-full",
            isCustomComboSelected
              ? "border-[#B38541] bg-[#FAF5EB] shadow-sm ring-1 ring-[#B38541]/60"
              : "border-dashed border-[#C5A880] bg-[#FCFAF6] hover:border-[#B38541] hover:bg-[#FAF5EA]"
          )}
        >
          {/* Floating Tooltip */}
          <div className="absolute bottom-[calc(100%+8px)] right-0 sm:left-1/2 sm:-translate-x-1/2 hidden group-hover:flex flex-col w-60 sm:w-68 p-3 rounded-xl bg-[#1A1715] text-[#FBF9F5] shadow-2xl border border-[#3E3832] z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="flex items-center justify-between gap-1.5 mb-1.5">
              <span className="text-xs font-bold text-[#D8B77E]">Custom Pair &amp; Combo AI</span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#2D2721] text-[#E5C992] border border-[#483E32] shrink-0">
                MULTI-ZONE
              </span>
            </div>
            <p className="text-[11px] leading-snug text-[#D1C7BA]">
              Combine any jewelry items (e.g. Jhumka + Anklet, Necklace + Ring). Opens the Pair Builder modal with multiple dropdowns and add button.
            </p>
            <div className="mt-2 pt-1.5 border-t border-[#2E2822] flex items-center gap-1.5 text-[10px] text-[#A69B8D]">
              <Sparkles className="w-2.5 h-2.5 text-[#D8B77E] shrink-0" />
              <span>Click to open Pair Builder modal</span>
            </div>
            <div className="absolute top-full right-6 sm:left-1/2 sm:-translate-x-1/2 -mt-1 w-2 h-2 rotate-45 bg-[#1A1715] border-r border-b border-[#3E3832]" />
          </div>

          <div className="w-full">
            <div className="flex items-start justify-between gap-1 w-full mb-1">
              <span
                className={cn(
                  "text-xs sm:text-xs font-bold tracking-tight flex items-center gap-1",
                  isCustomComboSelected ? "text-[#1A1715]" : "text-[#4A3D2D]"
                )}
              >
                <Layers className="w-3.5 h-3.5 text-[#B38541] shrink-0" />
                <span>Custom Pair / Combo</span>
              </span>
              <Info className="w-3 h-3 text-[#9E9589] group-hover:text-[#B38541] shrink-0 mt-0.5" />
            </div>

            <div className="mb-1.5">
              <span
                className={cn(
                  "inline-block text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md",
                  isCustomComboSelected
                    ? "bg-[#EFE3CF] text-[#7A561E] border border-[#DFC9A8]"
                    : "bg-[#EFE7D8] text-[#8C6428] border border-[#E3D6C1]"
                )}
              >
                PAIR / COMBO
              </span>
            </div>
          </div>

          <p
            className={cn(
              "text-[10px] sm:text-[11px] line-clamp-2 leading-snug mt-auto",
              isCustomComboSelected ? "text-[#7A561E] font-medium" : "text-[#7A736B]"
            )}
          >
            {isCustomComboSelected && customCategoryName
              ? customCategoryName
              : "Jhumka + Anklet, Necklace + Ring & more"}
          </p>
        </button>
      </div>

      {/* Active Custom Combo Pair Banner (Visible when Custom Combo is selected) */}
      {isCustomComboSelected && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FAF5EB] via-[#F7EFE1] to-[#F5EAD4] border border-[#DFC9A8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8C6428] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#1A1715]">
                  {customCategoryName || "Custom Coordinated Pair"}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#EFE3CF] text-[#7A561E] border border-[#D5C2A5]">
                  MULTI-ZONE AI ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-[#7A6B58] mt-0.5">
                Target Body Placements:{" "}
                <span className="font-semibold text-[#1A1715]">
                  {customPlacement || "ears, ankles"}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsPairModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-[#FAF6EF] text-[#8C6428] border border-[#DFC9A8] transition-colors shadow-xs flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modify Items in Pair</span>
          </button>
        </div>
      )}

      {/* Expandable Custom Single Category Details Form */}
      {isCustomSingleSelected && (
        <div className="p-4 rounded-2xl bg-[#FCFAF6] border border-[#EBE3D6] space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1A1715]">
              <Wand2 className="w-4 h-4 text-[#B38541]" />
              <span>Configure Custom Single Jewelry &amp; Placement</span>
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
                  onClick={() => handleApplySinglePreset(preset)}
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

      {/* Interactive Pair / Combo Builder Modal */}
      <Modal
        isOpen={isPairModalOpen}
        onClose={() => setIsPairModalOpen(false)}
        title="Create Custom Jewelry Pair / Combo"
        description="Select multiple single jewelry pieces to dress onto the model together in a unified try-on (e.g. Jhumka + Anklet)."
        maxWidth="xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsPairModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-[#DED6C9] bg-white text-[#7A736B] hover:text-[#1A1715] hover:bg-[#FAF7F2] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyPairModal}
              className="px-4 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#8C6428] via-[#B38541] to-[#8C6428] text-white shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Pair Combination</span>
            </button>
          </>
        }
      >
        <div className="space-y-2.5 sm:space-y-3">
          {/* Quick Presets */}
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#7A736B] block mb-1">
              Popular Quick Combos (Click to load):
            </span>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {POPULAR_PAIR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setPairItemIds(preset.itemIds)}
                  className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-[#F5EFE6] hover:bg-[#EFE5D5] text-[#7A561E] border border-[#E3D7C6] transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#B38541]" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* List of Dynamic Item Dropdowns */}
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1A1715] flex items-center gap-1.5">
                <span>Coordinated Jewelry Pieces</span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full bg-[#FAF3E6] text-[#8C6428] border border-[#E8DEC9] font-semibold">
                  {pairItemIds.length} {pairItemIds.length === 1 ? "Piece" : "Pieces"}
                </span>
              </label>
              <span className="text-[10px] sm:text-[11px] text-[#8C847A]">
                Dedicated anatomical placement
              </span>
            </div>

            <div className="space-y-1.5 max-h-[180px] sm:max-h-[210px] overflow-y-auto pr-0.5">
              {pairItemIds.map((selectedId, index) => {
                const itemObj =
                  SINGLE_JEWELRY_ITEMS.find((i) => i.id === selectedId) ||
                  SINGLE_JEWELRY_ITEMS[0];

                return (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl bg-[#FCFAF6] border border-[#EBE2D5] animate-in fade-in duration-150"
                  >
                    {/* Number Badge */}
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#EFE9DF] text-[#7A6B58] text-[11px] sm:text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>

                    {/* Luxury Themed Dropdown Select */}
                    <JewelryItemSelect
                      value={selectedId}
                      onChange={(newId) => handleUpdateDropdownItem(index, newId)}
                      disabled={disabled}
                    />

                    {/* Anatomical Placement Badge */}
                    <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded-xl bg-[#FAF5EB] text-[#7A561E] border border-[#E3D6C1] shrink-0 min-w-[65px] text-center shadow-xs">
                      {itemObj.placement}
                    </span>

                    {/* Remove Dropdown Button (Available if more than 1 item) */}
                    {pairItemIds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDropdown(index)}
                        title="Remove piece from combo"
                        className="p-1 sm:p-1.5 rounded-xl text-[#A69E94] hover:text-[#C93B3B] hover:bg-[#FDF2F2] transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Plus Icon Button to Add More Dropdowns */}
            <button
              type="button"
              onClick={handleAddDropdown}
              className="w-full py-1.5 sm:py-2 px-3 border border-dashed border-[#B38541] hover:border-[#8C6428] rounded-xl text-xs font-semibold text-[#8C6428] hover:text-[#704F1D] bg-[#FAF5EB]/60 hover:bg-[#FAF5EB] transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add One More Jewelry Item to Pair</span>
            </button>
          </div>

          {/* Live Preview Summary Box */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#F6F2EB] border border-[#E5DDD0] space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1A1715]">Combo Name:</span>
              <span className="font-bold text-[#8C6428] truncate max-w-[280px]">{currentPairName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#7A736B]">Body Placements:</span>
              <span className="font-semibold text-[#2C2723] uppercase text-[10px] bg-[#EDE5D8] px-1.5 py-0.5 rounded">
                {currentPairPlacements}
              </span>
            </div>
            <p className="text-[10px] text-[#8C847A] leading-tight pt-1 border-t border-[#E3DCD1]/80">
              ✨ Replaces any existing jewelry at these zones on the model and renders each item with master studio realism.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
