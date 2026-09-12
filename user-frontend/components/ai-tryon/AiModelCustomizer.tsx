"use client";

import * as React from "react";
import { AiModelConfig } from "../../types";
import {
  REGIONAL_ATTIRES,
  SKIN_TONES,
  HAIR_TYPES,
  HAIR_COLORS,
  EYE_COLORS,
  ARCHETYPE_PRESETS,
} from "../../constants/model-presets";
import { cn } from "../../lib/utils";
import { Sparkles, Wand2, Crown, Check, ChevronRight } from "lucide-react";

interface AiModelCustomizerProps {
  config: AiModelConfig;
  onChange: (newConfig: AiModelConfig) => void;
  disabled?: boolean;
}

export function AiModelCustomizer({
  config,
  onChange,
  disabled,
}: AiModelCustomizerProps) {
  const isMale = config.gender === "male";

  // Filter attires based on gender
  const availableAttires = REGIONAL_ATTIRES.filter((a) =>
    isMale ? a.gender === "male" : a.gender === "female"
  );

  const availableArchetypes = ARCHETYPE_PRESETS.filter(
    (p) => p.gender === config.gender
  );

  const handleGenderChange = (newGender: "female" | "male") => {
    if (newGender === config.gender) return;
    const defaultAttire = newGender === "male" ? "mens-sherwani" : "gujarati";
    onChange({
      ...config,
      gender: newGender,
      ethnicityRegion: defaultAttire,
      clothingStyle: defaultAttire,
      hairType: newGender === "male" ? "straight" : "wavy",
    });
  };

  const handleApplyArchetype = (archetype: typeof ARCHETYPE_PRESETS[0]) => {
    onChange({
      ...config,
      gender: archetype.gender,
      ethnicityRegion: archetype.config.ethnicityRegion,
      clothingStyle: archetype.config.clothingStyle,
      skinTone: archetype.config.skinTone,
      hairType: archetype.config.hairType,
      hairColor: archetype.config.hairColor,
      eyeColor: archetype.config.eyeColor,
    });
  };

  return (
    <div className="space-y-4 rounded-3xl bg-[#FCFAF7] border border-[#E8DFC9] p-5 sm:p-6 shadow-sm">
      {/* Header with Gender Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBE1D2]">
        <div>
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-[#B38541]" />
            <h3 className="text-sm font-semibold text-[#1A1715]">
              AI Virtual Model Persona Studio
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF3E6] text-[#7A561E] border border-[#E5D5BA]">
              Product-Only Mode
            </span>
          </div>
          <p className="text-xs text-[#7A736B] mt-0.5">
            Customize the AI model's regional Indian attire, skin tone, hair, and eye aesthetics.
          </p>
        </div>

        {/* Gender Toggle */}
        <div className="flex items-center p-0.5 rounded-xl bg-[#F0EBE3] border border-[#E4DCD0] shrink-0">
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleGenderChange("female")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5",
              !isMale
                ? "bg-white text-[#8C6428] shadow-xs"
                : "text-[#7A736B] hover:text-[#1A1715]"
            )}
          >
            <span>✨ Female Model</span>
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleGenderChange("male")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5",
              isMale
                ? "bg-white text-[#8C6428] shadow-xs"
                : "text-[#7A736B] hover:text-[#1A1715]"
            )}
          >
            <span>👑 Male Model</span>
          </button>
        </div>
      </div>

      {/* 1-Click Fast Archetypes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#3D3730] flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-[#B38541]" />
            <span>1-Click Curated Personas</span>
          </span>
          <span className="text-[11px] text-[#8C6428]">Instant Auto-Fill</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {availableArchetypes.map((archetype) => (
            <button
              key={archetype.id}
              type="button"
              disabled={disabled}
              onClick={() => handleApplyArchetype(archetype)}
              className={cn(
                "p-2.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between bg-white hover:border-[#B38541] hover:bg-[#FDFBF7]",
                config.clothingStyle === archetype.config.clothingStyle &&
                  config.skinTone === archetype.config.skinTone
                  ? "border-[#B38541] bg-[#FAF5EB] ring-1 ring-[#B38541]/40"
                  : "border-[#E5DDD2]"
              )}
            >
              <div>
                <span className="text-xs font-bold text-[#1A1715] block truncate">
                  {archetype.name}
                </span>
                <span className="text-[10px] text-[#7A736B] line-clamp-1 mt-0.5">
                  {archetype.subtitle}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Attire & Regional Style Grid */}
      <div className="space-y-2 pt-1">
        <label className="text-xs font-semibold text-[#3D3730] block">
          Attire &amp; Regional Cultural Style (Indian States &amp; Western)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {availableAttires.map((attire) => {
            const isSelected = config.clothingStyle === attire.id;

            return (
              <button
                key={attire.id}
                type="button"
                disabled={disabled}
                onClick={() =>
                  onChange({
                    ...config,
                    ethnicityRegion: attire.id,
                    clothingStyle: attire.id,
                  })
                }
                className={cn(
                  "p-3 rounded-xl border text-left transition-all duration-150 relative flex flex-col justify-between",
                  isSelected
                    ? "border-[#B38541] bg-[#FAF5EB] ring-1 ring-[#B38541]/50 shadow-xs"
                    : "border-[#E5DDD2] bg-white hover:border-[#D4C4AE] hover:bg-[#FDFCFB]"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#1A1715] truncate pr-2">
                      {attire.name}
                    </span>
                    {attire.badge && (
                      <span
                        className={cn(
                          "text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded shrink-0",
                          isSelected
                            ? "bg-[#EFE3CF] text-[#7A561E]"
                            : "bg-[#F3EDE4] text-[#857C72]"
                        )}
                      >
                        {attire.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#7A736B] line-clamp-2 leading-relaxed">
                    {attire.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Model Attributes: Skin Tone, Hair Texture, Hair Color, Eye Color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#EBE1D2]">
        {/* Skin Tone Palette */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#3D3730] block">
            Skin Tone &amp; Undertone
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SKIN_TONES.map((tone) => {
              const isSelected = config.skinTone === tone.id;

              return (
                <button
                  key={tone.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ ...config, skinTone: tone.id })}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all duration-150 flex items-center gap-2.5 bg-white",
                    isSelected
                      ? "border-[#B38541] bg-[#FAF5EB] ring-1 ring-[#B38541]/50"
                      : "border-[#E5DDD2] hover:border-[#D4C4AE]"
                  )}
                >
                  <span
                    className="w-6 h-6 rounded-full shrink-0 border border-black/10 shadow-xs flex items-center justify-center"
                    style={{ backgroundColor: tone.colorHex }}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#1A1715]" />}
                  </span>
                  <div className="truncate">
                    <span className="text-xs font-medium text-[#1A1715] block truncate">
                      {tone.name}
                    </span>
                    <span className="text-[10px] text-[#7A736B] block truncate">
                      {tone.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hairstyle / Texture */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#3D3730] block">
            Hair Texture &amp; Hairstyle
          </label>
          <div className="grid grid-cols-2 gap-2">
            {HAIR_TYPES.map((hair) => {
              const isSelected = config.hairType === hair.id;

              return (
                <button
                  key={hair.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ ...config, hairType: hair.id })}
                  className={cn(
                    "p-2.5 rounded-xl border text-left transition-all duration-150 bg-white truncate",
                    isSelected
                      ? "border-[#B38541] bg-[#FAF5EB] ring-1 ring-[#B38541]/50"
                      : "border-[#E5DDD2] hover:border-[#D4C4AE]"
                  )}
                >
                  <span className="text-xs font-medium text-[#1A1715] block truncate">
                    {hair.name}
                  </span>
                  <span className="text-[10px] text-[#7A736B] block truncate">
                    {hair.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hair Color & Eye Color Swatches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EBE1D2]">
        {/* Hair Color */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-[#3D3730] block">
            Hair Color
          </span>
          <div className="flex flex-wrap gap-2">
            {HAIR_COLORS.map((hc) => {
              const isSelected = config.hairColor === hc.id;

              return (
                <button
                  key={hc.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ ...config, hairColor: hc.id })}
                  className={cn(
                    "px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all duration-150 flex items-center gap-2 bg-white",
                    isSelected
                      ? "border-[#B38541] bg-[#FAF5EB] text-[#7A561E] ring-1 ring-[#B38541]/50 font-semibold"
                      : "border-[#E5DDD2] text-[#3D3730] hover:border-[#D4C4AE]"
                  )}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: hc.colorHex }}
                  />
                  <span>{hc.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Eye Color */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-[#3D3730] block">
            Eye Color
          </span>
          <div className="flex flex-wrap gap-2">
            {EYE_COLORS.map((ec) => {
              const isSelected = config.eyeColor === ec.id;

              return (
                <button
                  key={ec.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange({ ...config, eyeColor: ec.id })}
                  className={cn(
                    "px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all duration-150 flex items-center gap-2 bg-white",
                    isSelected
                      ? "border-[#B38541] bg-[#FAF5EB] text-[#7A561E] ring-1 ring-[#B38541]/50 font-semibold"
                      : "border-[#E5DDD2] text-[#3D3730] hover:border-[#D4C4AE]"
                  )}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: ec.colorHex }}
                  />
                  <span>{ec.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
