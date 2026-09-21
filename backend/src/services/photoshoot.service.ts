import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { geminiImageService } from "./gemini.service.js";
import {
  buildShotPrompt,
  PhotoshootShotType,
  PhotoshootPromptOptions,
  PhotoshootDisplayStyle,
  MASTER_PROMPT_CORE,
  JEWELRY_PRESERVATION_CORE,
} from "../prompts/photoshoot.prompt.js";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/errors.js";
import { membershipService } from "../membership/membership.service.js";

export interface GeneratePhotoshootInput {
  jewelryBuffer: Buffer;
  jewelryMime: string;
  category?: string;
  theme?: "luxury-studio" | "royal-bridal" | "minimal-white" | "dark-editorial";
  displayStyle?: PhotoshootDisplayStyle;
  aspectRatio?: "4:5" | "1:1" | "16:9";
  userId?: string;
}

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
  credits?: {
    totalCredits: number;
    usedCredits: number;
    remainingCredits: number;
    deducted: number;
  };
}

const DEFAULT_SHOT_TYPES: PhotoshootShotType[] = [
  "hero-model",
  "alternate-model",
  "product-hero",
  "product-angle",
  "macro-detail",
];

export class PhotoshootService {
  async generatePhotoshoot(
    input: GeneratePhotoshootInput
  ): Promise<PhotoshootCampaignResult> {
    const photoshootId = uuidv4();
    const category = input.category || "Luxury Jewelry";
    const theme = input.theme || "luxury-studio";
    const aspectRatio = input.aspectRatio || "4:5";

    logger.info(
      { photoshootId, category, theme, aspectRatio },
      "Initiating 5-image jewelry photoshoot campaign synthesis"
    );

    const outputDir = path.resolve(process.cwd(), "uploads", "photoshoots", photoshootId);
    await fs.mkdir(outputDir, { recursive: true });

    // 1. Save normalized source jewelry image
    const sourceWebp = await sharp(input.jewelryBuffer)
      .webp({ quality: 90 })
      .toBuffer();
    const sourceFilePath = path.join(outputDir, "source.webp");
    await fs.writeFile(sourceFilePath, sourceWebp);
    const sourceJewelryUrl = `/uploads/photoshoots/${photoshootId}/source.webp`;

    const promptOptions: PhotoshootPromptOptions = {
      category,
      theme,
      displayStyle: input.displayStyle || "marble-flatlay",
    };

    const shots: PhotoshootShotResult[] = [];

    // 2. Generate each of the 5 photoshoot shots sequentially to respect rate limits & ensure quality
    for (let i = 0; i < DEFAULT_SHOT_TYPES.length; i++) {
      const shotType = DEFAULT_SHOT_TYPES[i];
      const shotConfig = buildShotPrompt(shotType, promptOptions);
      const shotId = uuidv4();

      logger.info(
        { photoshootId, shotIndex: i + 1, shotType },
        `Generating photoshoot shot ${i + 1}/5: ${shotConfig.title}`
      );

      try {
        const generated = await geminiImageService.generateTryOn({
          jewelryBuffer: input.jewelryBuffer,
          jewelryMime: input.jewelryMime,
          prompt: shotConfig.prompt,
          aspectRatio,
        });

        const shotWebp = await sharp(generated.buffer)
          .webp({ quality: 92 })
          .toBuffer();

        const filename = `shot_${i + 1}_${shotType}.webp`;
        const filePath = path.join(outputDir, filename);
        await fs.writeFile(filePath, shotWebp);

        shots.push({
          id: shotId,
          type: shotType,
          title: shotConfig.title,
          description: shotConfig.description,
          imageUrl: `/uploads/photoshoots/${photoshootId}/${filename}`,
          aspectRatio,
        });
      } catch (err: any) {
        logger.error(
          { photoshootId, shotType, err: err.message },
          `Failed to generate shot ${shotType}, attempting fallback generation...`
        );

        // If at least one model shot and one product shot succeed, keep going
        if (shots.length >= 3 && i === DEFAULT_SHOT_TYPES.length - 1) {
          break;
        }

        // Try one retry with master preservation prompt
        try {
          const retryGen = await geminiImageService.generateTryOn({
            jewelryBuffer: input.jewelryBuffer,
            jewelryMime: input.jewelryMime,
            prompt: `${MASTER_PROMPT_CORE}\n\n${JEWELRY_PRESERVATION_CORE}\n\nShot: ${shotConfig.title}. High-end professional luxury jewelry photoshoot of the uploaded reference. Exact jewelry preservation, clean luxury composition, razor-sharp focus, commercial quality.`,
            aspectRatio,
          });

          const retryWebp = await sharp(retryGen.buffer).webp({ quality: 90 }).toBuffer();
          const filename = `shot_${i + 1}_${shotType}.webp`;
          await fs.writeFile(path.join(outputDir, filename), retryWebp);

          shots.push({
            id: shotId,
            type: shotType,
            title: shotConfig.title,
            description: shotConfig.description,
            imageUrl: `/uploads/photoshoots/${photoshootId}/${filename}`,
            aspectRatio,
          });
        } catch (retryErr: any) {
          logger.warn(
            { photoshootId, shotType, retryErr: retryErr.message },
            "Retry also failed for this shot."
          );
        }
      }
    }

    if (shots.length === 0) {
      throw new AppError(
        "AI_PROVIDER_ERROR",
        "Failed to generate jewelry photoshoot shots. Please check your Gemini API key and try again.",
        502
      );
    }

    const shotsCount = shots.length;
    let creditBalance = undefined;
    if (input.userId && input.userId !== "anonymous") {
      try {
        creditBalance = await membershipService.deductCredits({
          userId: input.userId,
          amount: shotsCount,
          generationId: photoshootId,
          category,
          mode: "photoshoot",
          prompt: `Jewelry photoshoot set of ${shotsCount} high-fidelity commercial shots (${theme})`,
          inputJewelryUrl: sourceJewelryUrl,
          outputUrl: shots[0]?.imageUrl,
        });
      } catch (creditErr) {
        logger.warn({ creditErr, userId: input.userId }, "Failed to deduct credits for photoshoot campaign");
      }
    }

    logger.info(
      { photoshootId, totalShots: shots.length, creditBalance },
      "Photoshoot campaign generated successfully"
    );

    return {
      id: photoshootId,
      sourceJewelryUrl,
      category,
      theme,
      totalShots: shots.length,
      shots,
      createdAt: new Date().toISOString(),
      credits: creditBalance,
    };
  }
}

export const photoshootService = new PhotoshootService();
