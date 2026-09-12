import * as React from "react";
import { BACKGROUND_OPTIONS, RATIO_OPTIONS, QUALITY_OPTIONS } from "../../constants/categories";
import { BackgroundType, AspectRatio, ImageSizeQuality } from "../../types";
import { CustomSelect } from "../ui/custom-select";
import { Sparkles, Crop, Zap } from "lucide-react";

interface GenerationSettingsProps {
  background: BackgroundType;
  onChangeBackground: (val: BackgroundType) => void;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (val: AspectRatio) => void;
  imageSize: ImageSizeQuality;
  onChangeImageSize: (val: ImageSizeQuality) => void;
  disabled?: boolean;
}

export function GenerationSettings({
  background,
  onChangeBackground,
  aspectRatio,
  onChangeAspectRatio,
  imageSize,
  onChangeImageSize,
  disabled,
}: GenerationSettingsProps) {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[#1A1715]">
          Generation Settings
        </label>
        <span className="text-xs text-[#8A837A]">Editorial Customization</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Background Setting */}
        <CustomSelect<BackgroundType>
          label="Background Environment"
          value={background}
          onChange={onChangeBackground}
          options={BACKGROUND_OPTIONS}
          disabled={disabled}
        />

        {/* Aspect Ratio Setting */}
        <CustomSelect<AspectRatio>
          label="Aspect Ratio"
          value={aspectRatio}
          onChange={onChangeAspectRatio}
          options={RATIO_OPTIONS}
          disabled={disabled}
        />

        {/* Quality Target */}
        <CustomSelect<ImageSizeQuality>
          label="Export Quality"
          value={imageSize}
          onChange={onChangeImageSize}
          options={QUALITY_OPTIONS}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
