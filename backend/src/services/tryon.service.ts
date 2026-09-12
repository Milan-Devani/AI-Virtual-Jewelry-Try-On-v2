import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { getStorageProvider } from "../storage/index.js";
import { geminiImageService } from "./gemini.service.js";
import { validateUploadedImage } from "../validators/imageValidator.js";
import { validateTryOnCompatibility } from "./vision-validator.service.js";
import { buildTryOnPrompt } from "../prompts/prompt-builder.js";
import { getCategoryById } from "../constants/categories.js";
import { logger } from "../utils/logger.js";
import {
  TryOnInput,
  GeneratedImageResult,
  GenerationRecord,
  BackgroundType,
  AspectRatio,
  ImageSizeQuality,
} from "../types/index.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";

// In-memory generation store for resilience and fast lookups
const memoryGenerationStore = new Map<string, GenerationRecord>();

export class TryOnService {
  async generateTryOn(input: TryOnInput): Promise<GeneratedImageResult> {
    const startTime = Date.now();
    const generationId = uuidv4();
    const userId = input.userId || "anonymous";
    const categoryInfo = getCategoryById(input.category);
    const categoryName = categoryInfo
      ? categoryInfo.name
      : input.customCategoryName || input.category;

    const background: BackgroundType = input.background || "studio";
    const aspectRatio: AspectRatio = input.aspectRatio || "4:5";
    const imageSize: ImageSizeQuality = input.imageSize || "2K";

    logger.info(
      {
        generationId,
        category: input.category,
        customCategoryName: input.customCategoryName,
        customPlacement: input.customPlacement,
        background,
        aspectRatio,
        imageSize,
      },
      "Initiating virtual try-on generation pipeline"
    );

    const isAiModelMode = input.mode === "ai-model";

    // 1. Strict Format & Dimension Validation
    let modelValidation = undefined;
    if (input.modelImage) {
      modelValidation = await validateUploadedImage(input.modelImage, "model");
    }
    const jewelryValidation = await validateUploadedImage(input.jewelryImage, "jewelry");

    // 2. AI Vision & Anatomical Compatibility Check (Top/Bottom/Category Mismatch)
    if (input.modelImage && modelValidation) {
      const visionCheck = await validateTryOnCompatibility({
        modelBuffer: input.modelImage.buffer,
        modelMime: modelValidation.mimeType || "image/jpeg",
        jewelryBuffer: input.jewelryImage.buffer,
        jewelryMime: jewelryValidation.mimeType || "image/png",
        category: input.category,
        customCategoryName: input.customCategoryName,
        customPlacement: input.customPlacement,
      });

      if (!visionCheck.valid) {
        logger.warn(
          { category: input.category, reason: visionCheck.reason },
          "Rejected try-on request due to anatomical or category mismatch"
        );
        throw new ValidationError(
          visionCheck.reason ||
            `The selected category '${categoryName}' is not compatible with the visible parts of the model or the uploaded jewelry product.`,
          "INVALID_CATEGORY",
          {
            suggestedCategory: visionCheck.suggestedCategory,
            detectedModelRegions: visionCheck.detectedModelRegions,
            detectedJewelryType: visionCheck.detectedJewelryType,
          }
        );
      }
    }

    const storage = getStorageProvider();

    // 3. Upload reference assets securely with UUID keys (models/{generationId}/model.webp)
    let storedModelUrl = "";
    if (input.modelImage) {
      const modelWebpBuffer = await sharp(input.modelImage.buffer).webp({ quality: 95 }).toBuffer();
      const storedModel = await storage.upload({
        key: `models/${generationId}/model.webp`,
        buffer: modelWebpBuffer,
        mimeType: "image/webp",
        isPublic: true,
      });
      storedModelUrl = storedModel.url;
    }

    const jewelryWebpBuffer = await sharp(input.jewelryImage.buffer).webp({ quality: 95 }).toBuffer();
    const storedJewelry = await storage.upload({
      key: `jewelry/${generationId}/product.webp`,
      buffer: jewelryWebpBuffer,
      mimeType: "image/webp",
      isPublic: true,
    });

    // 4. Register initial record
    const record: GenerationRecord = {
      id: generationId,
      userId,
      category: categoryName,
      background,
      aspectRatio,
      imageSize,
      modelImageUrl: storedModelUrl,
      jewelryImageUrl: storedJewelry.url,
      status: "processing",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryGenerationStore.set(generationId, record);

    try {
      // 5. Construct category-specific master prompt
      const prompt = buildTryOnPrompt({
        category: input.category,
        customCategoryName: input.customCategoryName,
        customPlacement: input.customPlacement,
        mode: input.mode,
        modelConfig: input.modelConfig,
        background,
        aspectRatio,
        imageSize,
      });

      // 6. Generate with Gemini
      const generatedRaw = await geminiImageService.generateTryOn({
        modelBuffer: input.modelImage ? input.modelImage.buffer : undefined,
        modelMime: modelValidation?.mimeType || "image/jpeg",
        jewelryBuffer: input.jewelryImage.buffer,
        jewelryMime: jewelryValidation.mimeType || "image/png",
        prompt,
        aspectRatio,
      });

      // 7. Post-process to high-quality WebP
      const processedWebp = await sharp(generatedRaw.buffer)
        .webp({ quality: 92, effort: 4 })
        .toBuffer();

      // 8. Store generated asset
      const storedGenerated = await storage.upload({
        key: `generated/${generationId}/result.webp`,
        buffer: processedWebp,
        mimeType: "image/webp",
        isPublic: true,
      });

      const durationMs = Date.now() - startTime;

      // 9. Update record
      record.status = "completed";
      record.generatedImageUrl = storedGenerated.url;
      record.durationMs = durationMs;
      record.updatedAt = new Date().toISOString();
      memoryGenerationStore.set(generationId, record);

      // 10. Persist to database & deduct 1 credit
      if (process.env.DATABASE_URL && userId && userId !== "anonymous") {
        try {
          const { prisma } = await import("../config/prisma.js");
          await prisma.generationUsage.create({
            data: {
              id: generationId,
              userId,
              category: categoryName,
              mode: input.mode || "custom-model",
              modelConfig: input.modelConfig ? (input.modelConfig as any) : undefined,
              prompt,
              inputModelUrl: storedModelUrl || undefined,
              inputJewelryUrl: storedJewelry.url,
              outputImageUrl: storedGenerated.url,
              status: "success",
              creditsUsed: 1,
            },
          });
        } catch (dbErr) {
          logger.warn({ dbErr }, "Failed to write generation usage to database");
        }
      } else if (userId && userId !== "anonymous") {
        try {
          const { mockStore } = await import("../mock/mockStore.js");
          const user = mockStore.users.find((u) => u.id === userId);
          if (user) {
            user.totalGenerations = (user.totalGenerations || 0) + 1;
          }
        } catch (mockErr) {
          logger.warn({ mockErr }, "Failed to update mock store generation count");
        }
      }

      logger.info(
        { generationId, durationMs, status: "completed" },
        "Virtual try-on generation successfully completed"
      );

      return {
        id: generationId,
        category: input.category,
        categoryName,
        imageUrl: storedGenerated.url,
        modelImageUrl: storedModelUrl,
        jewelryImageUrl: storedJewelry.url,
        background,
        aspectRatio,
        imageSize,
        createdAt: record.createdAt,
        durationMs,
      };
    } catch (err: unknown) {
      record.status = "failed";
      record.errorCode = (err as { code?: string })?.code || "AI_PROVIDER_ERROR";
      record.errorMessage = (err as Error)?.message || "Unknown error";
      record.updatedAt = new Date().toISOString();
      memoryGenerationStore.set(generationId, record);

      // Log failure in database with 0 credits consumed
      if (process.env.DATABASE_URL && userId && userId !== "anonymous") {
        try {
          const { prisma } = await import("../config/prisma.js");
          await prisma.generationUsage.create({
            data: {
              id: generationId,
              userId,
              category: categoryName,
              mode: input.mode || "custom-model",
              outputImageUrl: "",
              status: "failed",
              creditsUsed: 0,
            },
          });
        } catch {}
      }

      logger.error({ generationId, err }, "Virtual try-on generation failed");
      throw err;
    }
  }

  async getGenerationById(id: string): Promise<GenerationRecord> {
    const record = memoryGenerationStore.get(id);
    if (!record) {
      throw new NotFoundError(`Generation with ID ${id} not found.`);
    }
    return record;
  }

  async listHistory(userId?: string, category?: string): Promise<GenerationRecord[]> {
    let records = Array.from(memoryGenerationStore.values());

    if (userId && userId !== "all") {
      records = records.filter((r) => r.userId === userId || r.userId === "anonymous");
    }

    if (category && category !== "all") {
      records = records.filter((r) => r.category.toLowerCase() === category.toLowerCase());
    }

    return records.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async deleteGeneration(id: string): Promise<void> {
    const record = memoryGenerationStore.get(id);
    if (!record) {
      throw new NotFoundError(`Generation with ID ${id} not found.`);
    }

    const storage = getStorageProvider();
    await Promise.allSettled([
      storage.delete(`models/${id}/model.webp`),
      storage.delete(`jewelry/${id}/product.webp`),
      storage.delete(`generated/${id}/result.webp`),
    ]);

    memoryGenerationStore.delete(id);
    logger.info({ id }, "Deleted generation record and associated assets");
  }
}

export const tryOnService = new TryOnService();
