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
  storyboardImages?: string[];
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
  storyboardImages?: string[];
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
   * Generate cinematic video using Google Veo 3.1
   */
  private async executeVeoPrediction(
    modelName: string,
    geminiApiKey: string,
    imageBuffer: Buffer,
    prompt: string,
    durationSeconds: number,
    aspectRatio: string
  ): Promise<Buffer> {
    const targetAspectRatio = aspectRatio === "16:9" ? "16:9" : "9:16";
    // Veo 3.1 supports 4, 6, or 8 seconds
    const targetDuration = durationSeconds >= 7 ? 8 : durationSeconds >= 5 ? 6 : 4;

    logger.info(
      { modelName, targetAspectRatio, targetDuration },
      "Submitting image-to-video generation request to Google Veo 3.1..."
    );

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predictLongRunning?key=${geminiApiKey}`;
    const requestBody = {
      instances: [
        {
          prompt,
          image: {
            bytesBase64Encoded: imageBuffer.toString("base64"),
            mimeType: "image/jpeg",
          },
        },
      ],
      parameters: {
        aspectRatio: targetAspectRatio,
        durationSeconds: targetDuration,
      },
    };

    const submitRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!submitRes.ok) {
      const errText = await submitRes.text();
      throw new Error(`Google Veo API submit failed (HTTP ${submitRes.status}): ${errText}`);
    }

    const submitData = (await submitRes.json()) as any;
    if (submitData.error) {
      throw new Error(submitData.error.message || JSON.stringify(submitData.error));
    }

    const opName = submitData.name;
    if (!opName) {
      throw new Error("Google Veo did not return an operation identifier.");
    }

    logger.info({ opName, modelName }, "Google Veo 3.1 operation started, polling for completion...");

    const startTime = Date.now();
    const timeoutMs = 180000;
    const pollIntervalMs = 4000;

    while (Date.now() - startTime < timeoutMs) {
      await new Promise((r) => setTimeout(r, pollIntervalMs));

      const pollUrl = `https://generativelanguage.googleapis.com/v1beta/${opName}?key=${geminiApiKey}`;
      const pollRes = await fetch(pollUrl);
      if (!pollRes.ok) {
        logger.warn({ status: pollRes.status }, "Veo poll request returned non-200, retrying...");
        continue;
      }

      const opData = (await pollRes.json()) as any;
      if (opData.error) {
        throw new Error(`Veo operation error: ${opData.error.message || JSON.stringify(opData.error)}`);
      }

      if (opData.done) {
        const videoUri =
          opData.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
        if (!videoUri) {
          throw new Error("Veo operation completed but video URI was missing in response.");
        }

        logger.info({ videoUri }, "Veo video synthesis complete! Downloading MP4 stream...");
        const downloadRes = await fetch(`${videoUri}&key=${geminiApiKey}`);
        if (!downloadRes.ok) {
          throw new Error(`Failed to download Veo video payload (HTTP ${downloadRes.status})`);
        }

        const arrayBuf = await downloadRes.arrayBuffer();
        return Buffer.from(arrayBuf);
      }
    }

    throw new Error(`Google Veo generation timed out after ${timeoutMs / 1000}s.`);
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
      // zerogpu-aoti/wan2-2-fp8da-aoti-faster (supports up to 5.0s)
      // params: [input_image, prompt, steps, negative_prompt, duration_seconds, guidance_scale, guidance_scale_2, seed, randomize_seed]
      result = await client.predict("/generate_video", [
        imageHandle,
        prompt,
        4, // fast 4-step induction
        negativePrompt,
        Math.min(Math.max(durationSeconds, 2), 5.0),
        1.0, // guidance_scale
        1.0, // guidance_scale_2
        Math.floor(Math.random() * 1000000),
        true, // randomize_seed
      ]);
    } else if (spaceName.includes("wan2-1-fast")) {
      // multimodalart/wan2-1-fast (Gradio slider capped at 3.4s)
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
      // Generic fallback (r3gm or similar preview - supports up to 5.0s)
      result = await client.predict("/generate_video", [
        imageHandle,
        prompt,
        4,
        negativePrompt,
        Math.min(Math.max(durationSeconds, 2), 5.0),
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
      storyboardImages: input.storyboardImages,
    });

    logger.info(
      { videoId, aspectRatio, motionStyle, duration, promptPreview: prompt.slice(0, 100) },
      "Starting photorealistic luxury jewelry video campaign generation"
    );

    const tempDir = path.resolve(process.cwd(), "uploads", "temp", videoId);
    let preparedJpgPath: string | null = null;

    try {
      // 1. Fetch & normalize source image
      const sourceBuffer = await this.fetchImageBuffer(input.imageUrl);
      preparedJpgPath = await this.prepareImageFile(sourceBuffer, aspectRatio, tempDir);

      let videoBuffer: Buffer | null = null;
      let engineUsed = "veo-3.1";

      // 2. Primary Engine: Google Veo 3.1 (Cinematic 1080p, up to 8s native takes)
      const geminiApiKey = config.gemini.apiKey;
      const veoModel = config.gemini.videoModel || "veo-3.1-generate-preview";

      if (geminiApiKey) {
        try {
          logger.info({ veoModel, videoId }, "Dispatching video generation to primary engine Google Veo 3.1");
          const preparedJpegBuffer = await fs.readFile(preparedJpgPath);
          videoBuffer = await this.executeVeoPrediction(
            veoModel,
            geminiApiKey,
            preparedJpegBuffer,
            prompt,
            duration,
            aspectRatio
          );
          logger.info({ videoId, bytes: videoBuffer.length }, "Google Veo 3.1 successfully generated jewelry campaign video!");
        } catch (veoErr: any) {
          logger.warn(
            { videoId, error: veoErr.message },
            "Google Veo 3.1 encountered an issue, falling back to Wan 2.1 GPU spaces..."
          );
        }
      }

      // 3. Fallback Engine: Wan 2.1 on Gradio ZeroGPU
      if (!videoBuffer) {
        engineUsed = "wan-2.1";
        const hfToken = config.video.hfToken || process.env.HF_TOKEN;
        if (!hfToken) {
          throw new AppError(
            "AI_PROVIDER_ERROR",
            "Video generation failed on Google Veo 3.1 and Hugging Face token (HF_TOKEN) is not configured in backend/.env",
            500
          );
        }

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
            lastError?.message || "All video generation engines were unavailable or busy."
          );
        }

        const videoRes = await fetch(remoteVideoUrl, {
          headers: { Authorization: `Bearer ${hfToken}` },
        });

        if (!videoRes.ok) {
          throw new Error(`Failed to download rendered video from model host: ${videoRes.statusText}`);
        }

        const arrayBuf = await videoRes.arrayBuffer();
        videoBuffer = Buffer.from(arrayBuf);
      }

      const outputDir = path.resolve(process.cwd(), "uploads", "videos", videoId);
      await fs.mkdir(outputDir, { recursive: true });
      const localVideoFile = path.join(outputDir, "runway.mp4");
      await fs.writeFile(localVideoFile, videoBuffer);

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
        storyboardImages: input.storyboardImages,
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
