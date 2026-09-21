export type AspectRatio = "1:1" | "3:4" | "4:5" | "16:9";
export type ImageSizeQuality = "1K" | "2K" | "4K";
export type BackgroundType = "studio" | "luxury" | "minimal" | "outdoor";
export type GenerationStatus = "idle" | "uploading" | "processing" | "completed" | "failed";
export type TryOnMode = "custom-model" | "ai-model" | "image-to-video" | "multi-img";

export type PhotoshootDisplayStyle = "marble-flatlay" | "linen-bust" | "studio-pedestal";

export type PhotoshootShotType =
  | "hero-model"
  | "alternate-model"
  | "product-hero"
  | "product-angle"
  | "macro-detail";

export interface PhotoshootShotResult {
  id: string;
  type: PhotoshootShotType;
  title: string;
  description: string;
  imageUrl: string;
  aspectRatio: string;
}

export interface PhotoshootCampaignResult {
  id: string;
  sourceJewelryUrl: string;
  category: string;
  theme: string;
  totalShots: number;
  shots: PhotoshootShotResult[];
  createdAt: string;
}

export interface AiModelConfig {
  gender: "female" | "male";
  ethnicityRegion: string;
  skinTone: string;
  hairType: string;
  hairColor: string;
  eyeColor: string;
  clothingStyle: string;
  clothingColor?: string;
  ageGroup?: string;
  expression?: string;
}

export interface JewelryCategory {
  id: string;
  name: string;
  placement: string;
  gender?: "female" | "male" | "unisex";
  description: string;
  suggestedAspectRatio: AspectRatio;
}

export interface TryOnGenerationResult {
  id: string;
  category: string;
  categoryName: string;
  customCategoryName?: string;
  customPlacement?: string;
  imageUrl: string;
  modelImageUrl?: string;
  jewelryImageUrl: string;
  background: BackgroundType;
  aspectRatio: AspectRatio;
  imageSize: ImageSizeQuality;
  createdAt: string;
  durationMs?: number;
}

export interface GenerationRecord {
  id: string;
  userId: string;
  category: string;
  background: BackgroundType;
  aspectRatio: AspectRatio;
  imageSize: ImageSizeQuality;
  modelImageUrl: string;
  jewelryImageUrl: string;
  generatedImageUrl?: string;
  status: "pending" | "processing" | "completed" | "failed";
  errorCode?: string;
  errorMessage?: string;
  durationMs?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ImageFileState {
  file: File | null;
  previewUrl: string | null;
  name: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  isValid: boolean;
  error?: string;
}
