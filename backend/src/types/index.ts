export type AspectRatio = "1:1" | "3:4" | "4:5" | "16:9";
export type ImageSizeQuality = "1K" | "2K" | "4K";
export type BackgroundType = "studio" | "luxury" | "minimal" | "outdoor";
export type GenerationStatus = "pending" | "processing" | "completed" | "failed";
export type TryOnMode = "custom-model" | "ai-model";

export interface AiModelConfig {
  gender: "female" | "male";
  ethnicityRegion:
    | "pan-indian"
    | "gujarati"
    | "south-indian"
    | "maharashtrian"
    | "punjabi"
    | "kerala"
    | "bengali"
    | "tamil-nadu"
    | "rajasthani"
    | "assamese"
    | "western"
    | string;
  skinTone: "fair" | "wheatish" | "dusky" | "deep" | string;
  hairType: "straight" | "wavy" | "curly" | "coily" | "bridal-updo" | "traditional-braid" | string;
  hairColor: "natural-black" | "dark-brown" | "chestnut" | "burgundy" | "blonde" | string;
  eyeColor: "deep-brown" | "amber-hazel" | "black" | "forest-green" | "slate-gray" | string;
  clothingStyle: string;
  clothingColor?: string;
  ageGroup?: "young-adult" | "adult" | "mature" | string;
  expression?: "editorial-serene" | "warm-smile" | "royal-poised" | string;
}

export interface TryOnInput {
  modelImage?: Express.Multer.File;
  jewelryImage: Express.Multer.File;
  category: string;
  customCategoryName?: string;
  customPlacement?: string;
  mode?: TryOnMode;
  modelConfig?: AiModelConfig;
  background?: BackgroundType;
  aspectRatio?: AspectRatio;
  imageSize?: ImageSizeQuality;
  userId?: string;
}

export interface GeneratedImageResult {
  id: string;
  category: string;
  categoryName: string;
  imageUrl: string;
  modelImageUrl: string;
  jewelryImageUrl: string;
  background: BackgroundType;
  aspectRatio: AspectRatio;
  imageSize: ImageSizeQuality;
  createdAt: string;
  durationMs?: number;
  credits?: {
    totalCredits: number;
    usedCredits: number;
    remainingCredits: number;
    deducted: number;
  };
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
  status: GenerationStatus;
  errorCode?: string;
  errorMessage?: string;
  durationMs?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ImageValidationResult {
  valid: boolean;
  reason?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  fileSizeBytes?: number;
}

export interface StorageResult {
  key: string;
  url: string;
  provider: "supabase" | "s3" | "local";
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
