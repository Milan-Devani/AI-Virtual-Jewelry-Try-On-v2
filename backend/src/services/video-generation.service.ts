import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Client, handle_file } from "@gradio/client";
import sharp from "sharp";
import { config } from "../config/env.config.js";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/errors.js";
import { membershipService } from "../membership/membership.service.js";
import {
  buildVideoPrompt,
  VIDEO_NEGATIVE_PROMPT,
  UGC_CINEMATIC_NEGATIVE_PROMPT,
  MASTER_VIDEO_PROMPT_CORE,
} from "../prompts/video.prompt.js";

export interface GenerateVideoInput {
  imageUrl: string;
  category?: string;
  aspectRatio?: "9:16" | "4:5" | "16:9" | "1:1";
  motionStyle?: "head-turn" | "editorial-smile" | "subtle-sparkle" | "runway-pose" | "ugc-cinematic";
  durationSeconds?: number;
  userId?: string;
  customPrompt?: string;
  negativePrompt?: string;
}

export interface GenerateVideoResult {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  aspectRatio: string;
  durationSeconds: number;
  motionStyle: string;
  prompt: string;
  createdAt: string;
  credits?: {
    totalCredits: number;
    usedCredits: number;
    remainingCredits: number;
    deducted: number;
  };
}

// Aspect ratio to resolution mapping (optimal multiples of 16/32 for diffusion models)
function getTargetDimensions(aspectRatio: string): { width: number; height: number } {
  switch (aspectRatio) {
    case "9:16":
      // Vertical (Reels / TikTok / YouTube Shorts)
      return { width: 480, height: 832 };
    case "4:5":
      // Instagram Portrait Feed
      return { width: 576, height: 720 };
    case "16:9":
      // Landscape Cinematic
      return { width: 832, height: 480 };
    case "1:1":
    default:
      // Square
      return { width: 640, height: 640 };
  }
}


export class VideoGenerationService {
  /**
   * Resolve an image input into a local file buffer.
   * Handles local filesystem shortcuts, relative URLs, and external URLs.
   */
  private async fetchImageBuffer(imageUrl: string): Promise<Buffer> {
    // If it's a localhost or relative URL, try direct disk read first
    let localPath: string | null = null;

    if (imageUrl.startsWith("/")) {
      localPath = path.resolve(process.cwd(), imageUrl.replace(/^\//, ""));
    } else if (imageUrl.includes("localhost:4000/uploads/") || imageUrl.includes("127.0.0.1:4000/uploads/")) {
      const sub = imageUrl.split("/uploads/")[1];
      if (sub) {
        localPath = path.resolve(process.cwd(), "uploads", sub);
      }
    }

    if (localPath) {
      try {
        return await fs.readFile(localPath);
      } catch {
        // Fall back to HTTP fetch if direct disk access fails
      }
    }

    // Standard HTTP fetch
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new AppError("INVALID_IMAGE", `Could not retrieve source image: ${response.statusText}`, 400);
    }
    const arrayBuf = await response.arrayBuffer();
    return Buffer.from(arrayBuf);
  }

  /**
   * Pre-process source image using sharp:
   * - Converts WebP/PNG to standard RGB JPEG
   * - Resizes and crops to exact aspect ratio dimensions (multiples of 16/32)
   * - Writes to a dedicated temp file for gradio upload
   */
  private async prepareImageFile(
    sourceBuffer: Buffer,
    aspectRatio: string,
    tempDir: string
  ): Promise<string> {
    const { width, height } = getTargetDimensions(aspectRatio);
    await fs.mkdir(tempDir, { recursive: true });
    const targetFile = path.join(tempDir, `prepared_${Date.now()}.jpg`);

    await sharp(sourceBuffer)
      .resize(width, height, { fit: "cover", position: "center" })
      .jpeg({ quality: 95 })
      .toFile(targetFile);

    return targetFile;
  }

  /**
   * Attempt generation on a Gradio space with automatic failover
   */
  private async executeGradioPrediction(
    spaceName: string,
    hfToken: string,
    imagePath: string,
    prompt: string,
    durationSeconds: number,
    aspectRatio: string,
    customNegativePrompt?: string
  ): Promise<string> {
    logger.info({ spaceName }, "Connecting to Hugging Face Space for video generation...");
    const client = await Client.connect(spaceName, { token: hfToken as any });
    const imageHandle = handle_file(imagePath);

    const negativePrompt = customNegativePrompt || VIDEO_NEGATIVE_PROMPT;

    let result: any;

    if (spaceName.includes("wan2-2-fp8da-aoti-faster")) {
      // zerogpu-aoti/wan2-2-fp8da-aoti-faster
      // params: [input_image, prompt, steps, negative_prompt, duration_seconds, guidance_scale, guidance_scale_2, seed, randomize_seed]
      result = await client.predict("/generate_video", [
        imageHandle,
        prompt,
        4, // fast 4-step induction
        negativePrompt,
        Math.min(Math.max(durationSeconds, 2), 3.5),
        1.0, // guidance_scale
        1.0, // guidance_scale_2
        Math.floor(Math.random() * 1000000),
        true, // randomize_seed
      ]);
    } else if (spaceName.includes("wan2-1-fast")) {
      // multimodalart/wan2-1-fast
      const { width, height } = getTargetDimensions(aspectRatio);
      result = await client.predict("/generate_video", [
        imageHandle,
        prompt,
        height,
        width,
        negativePrompt,
        Math.min(Math.max(durationSeconds, 2), 3.4),
        1.0,
        4,
        Math.floor(Math.random() * 1000000),
        true,
      ]);
    } else {
      // Generic fallback (r3gm or similar preview)
      result = await client.predict("/generate_video", [
        imageHandle,
        prompt,
        4,
        negativePrompt,
        Math.min(Math.max(durationSeconds, 2), 3.5),
        1.0,
        1.0,
        Math.floor(Math.random() * 1000000),
        true,
      ]);
    }

    if (!result?.data || !result.data[0]) {
      throw new Error(`Empty response received from ${spaceName}`);
    }

    const videoData = result.data[0];
    const remoteUrl =
      videoData?.video?.url ||
      videoData?.url ||
      (typeof videoData === "string" ? videoData : null);

    if (!remoteUrl) {
      throw new Error(`Invalid video output payload from ${spaceName}`);
    }

    return remoteUrl;
  }

  async generateVideo(input: GenerateVideoInput): Promise<GenerateVideoResult> {
    const videoId = uuidv4();
    const aspectRatio = input.aspectRatio || "9:16";
    const motionStyle = input.motionStyle || "head-turn";
    const duration = Math.min(Math.max(input.durationSeconds || 15, 2), 20);
    const prompt = buildVideoPrompt({
      category: input.category,
      motionStyle,
      customPrompt: input.customPrompt,
      durationSeconds: duration,
    });

    logger.info(
      { videoId, aspectRatio, motionStyle, duration, promptPreview: prompt.slice(0, 100) },
      "Starting photorealistic luxury jewelry video campaign generation"
    );

    const hfToken = config.video.hfToken || process.env.HF_TOKEN;
    if (!hfToken) {
      throw new AppError(
        "AI_PROVIDER_ERROR",
        "Hugging Face token (HF_TOKEN) is not configured in backend/.env",
        500
      );
    }

    const tempDir = path.resolve(process.cwd(), "uploads", "temp", videoId);
    let preparedJpgPath: string | null = null;

    try {
      // 1. Fetch & normalize source image
      const sourceBuffer = await this.fetchImageBuffer(input.imageUrl);
      preparedJpgPath = await this.prepareImageFile(sourceBuffer, aspectRatio, tempDir);

      // 2. High-availability Space Pool with automatic failover
      const candidateSpaces = [
        "zerogpu-aoti/wan2-2-fp8da-aoti-faster",
        "r3gm/wan2-2-fp8da-aoti-preview",
        "multimodalart/wan2-1-fast",
      ];

      let remoteVideoUrl: string | null = null;
      let lastError: Error | null = null;

      for (const space of candidateSpaces) {
        try {
          const activeNegative =
            input.negativePrompt ||
            (motionStyle === "ugc-cinematic"
              ? UGC_CINEMATIC_NEGATIVE_PROMPT
              : VIDEO_NEGATIVE_PROMPT);

          remoteVideoUrl = await this.executeGradioPrediction(
            space,
            hfToken,
            preparedJpgPath,
            prompt,
            duration,
            aspectRatio,
            activeNegative
          );
          if (remoteVideoUrl) {
            logger.info({ space, videoId }, "Candidate Space successfully generated video!");
            break;
          }
        } catch (spaceErr: any) {
          logger.warn(
            { space, videoId, error: spaceErr.message },
            "Candidate Space failed, attempting next failover candidate..."
          );
          lastError = spaceErr;
        }
      }

      if (!remoteVideoUrl) {
        throw new Error(
          lastError?.message || "All video generation candidate spaces were unavailable or busy."
        );
      }

      // 3. Download the generated MP4 locally with auth header
      const videoRes = await fetch(remoteVideoUrl, {
        headers: { Authorization: `Bearer ${hfToken}` },
      });

      if (!videoRes.ok) {
        throw new Error(`Failed to download rendered video from model host: ${videoRes.statusText}`);
      }

      const outputDir = path.resolve(process.cwd(), "uploads", "videos", videoId);
      await fs.mkdir(outputDir, { recursive: true });
      const localVideoFile = path.join(outputDir, "runway.mp4");

      const videoBuffer = await videoRes.arrayBuffer();
      await fs.writeFile(localVideoFile, Buffer.from(videoBuffer));

      const finalVideoUrl = `/uploads/videos/${videoId}/runway.mp4`;

      let creditBalance = undefined;
      if (input.userId && input.userId !== "anonymous") {
        try {
          creditBalance = await membershipService.deductCredits({
            userId: input.userId,
            amount: 1,
            generationId: videoId,
            category: input.category || "jewelry",
            mode: "image-to-video",
            prompt,
            inputJewelryUrl: input.imageUrl,
            outputUrl: finalVideoUrl,
          });
        } catch (creditErr) {
          logger.warn({ creditErr, userId: input.userId }, "Failed to deduct credits for video generation");
        }
      }

      logger.info(
        { videoId, finalVideoUrl, sizeBytes: videoBuffer.byteLength, creditBalance },
        "AI Video Try-On successfully rendered and saved"
      );

      return {
        id: videoId,
        videoUrl: finalVideoUrl,
        thumbnailUrl: input.imageUrl,
        aspectRatio,
        durationSeconds: duration,
        motionStyle,
        prompt,
        createdAt: new Date().toISOString(),
        credits: creditBalance,
      };
    } catch (err: any) {
      logger.error({ videoId, err: err.message }, "AI Video Try-On generation failed");
      throw new AppError(
        "VIDEO_GENERATION_FAILED",
        `Failed to generate video: ${err.message}`,
        502
      );
    } finally {
      // Clean up temporary pre-processed image
      if (preparedJpgPath) {
        fs.unlink(preparedJpgPath).catch(() => {});
      }
      fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}

export const videoGenerationService = new VideoGenerationService();
