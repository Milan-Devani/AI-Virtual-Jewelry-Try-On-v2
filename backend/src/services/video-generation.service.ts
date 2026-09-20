import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Client } from "@gradio/client";
import { config } from "../config/env.config.js";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/errors.js";

export interface GenerateVideoInput {
  imageUrl: string;
  category?: string;
  aspectRatio?: "9:16" | "4:5" | "16:9" | "1:1";
  motionStyle?: "head-turn" | "editorial-smile" | "subtle-sparkle" | "runway-pose";
  durationSeconds?: number;
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
}

// Aspect ratio to resolution mapping (multiples of 32 required by Wan 2.1)
function getDimensions(aspectRatio: string): { width: number; height: number } {
  switch (aspectRatio) {
    case "9:16":
      // Vertical (Reels / TikTok / Shorts)
      return { width: 512, height: 896 };
    case "4:5":
      // Instagram Portrait Feed
      return { width: 576, height: 704 };
    case "16:9":
      // Landscape Cinematic
      return { width: 896, height: 512 };
    case "1:1":
    default:
      // Square
      return { width: 640, height: 640 };
  }
}

// Build high-end cinematic prompt focused on jewelry optical reflections & human realism
function buildVideoPrompt(category = "jewelry", motionStyle = "head-turn"): string {
  const motionDirectives: Record<string, string> = {
    "head-turn":
      "The model slowly and elegantly turns her head toward the soft studio light, softly blinking, revealing subtle regal smile. Diamond and gold reflections shimmer naturally.",
    "editorial-smile":
      "Model gently tilts her chin up, looking into the camera with serene editorial confidence, soft eye contact, gentle breathing, jewelry catching warm studio highlights.",
    "subtle-sparkle":
      "Slow micro-pan across the jewelry pieces, prismatic diamond caustics and gleaming gold luster catching softbox lighting, ultra-realistic metal shine.",
    "runway-pose":
      "Slow-motion high-fashion commercial runway movement, model shoulders and head gently swaying with natural elegance, hair catching a soft breeze.",
  };

  const selectedMotion = motionDirectives[motionStyle] || motionDirectives["head-turn"];

  return [
    `8k cinematic macro video of a luxury ${category} commercial photoshoot.`,
    selectedMotion,
    "Real human skin texture with natural pores, subcutaneous warmth, genuine eye reflections, individual fine hair strands.",
    "Ray-traced physical caustics, soft prismatic sparkles on gemstones and gold, zero warping, zero jewelry deformation, authentic 35mm lens depth of field, photorealistic 60fps luxury editorial master.",
  ].join(" ");
}

export class VideoGenerationService {
  async generateVideo(input: GenerateVideoInput): Promise<GenerateVideoResult> {
    const videoId = uuidv4();
    const aspectRatio = input.aspectRatio || "9:16";
    const motionStyle = input.motionStyle || "head-turn";
    const duration = Math.min(Math.max(input.durationSeconds || 3, 2), 5);
    const { width, height } = getDimensions(aspectRatio);
    const prompt = buildVideoPrompt(input.category, motionStyle);

    logger.info(
      { videoId, aspectRatio, motionStyle, duration, width, height },
      "Starting AI video generation via Wan 2.1"
    );

    // Resolve input image: Can be URL or local file path
    let imagePayload: any;
    let localImagePath: string | null = null;

    if (input.imageUrl.startsWith("http://") || input.imageUrl.startsWith("https://")) {
      // Fetch image buffer
      const res = await fetch(input.imageUrl);
      if (!res.ok) {
        throw new AppError("INVALID_IMAGE", `Could not fetch source image: ${res.statusText}`, 400);
      }
      const buffer = await res.arrayBuffer();
      imagePayload = new Blob([buffer], { type: "image/jpeg" });
    } else {
      // Local path in public uploads
      const cleanPath = input.imageUrl.replace(/^\//, "");
      const possiblePath = path.resolve(process.cwd(), cleanPath);
      try {
        const buffer = await fs.readFile(possiblePath);
        imagePayload = new Blob([buffer], { type: "image/jpeg" });
        localImagePath = possiblePath;
      } catch (readErr) {
        throw new AppError("NOT_FOUND", `Local try-on image not found at ${cleanPath}`, 404);
      }
    }

    const hfToken = config.video.hfToken || process.env.HF_TOKEN;
    if (!hfToken) {
      throw new AppError("AI_PROVIDER_ERROR", "Hugging Face token (HF_TOKEN) is not configured in backend/.env", 500);
    }

    try {
      // Connect to Wan 2.1 Fast on Hugging Face (ZeroGPU, 100% free)
      const app = await Client.connect("multimodalart/wan2-1-fast", {
        token: hfToken as any,
      });

      logger.info({ videoId }, "Connected to Hugging Face Wan 2.1 Space, submitting generation...");

      const result: any = await app.predict("/generate_video", [
        imagePayload,
        prompt,
        height,
        width,
        "overexposed, static, blurred details, subtitles, style, works, paintings, images, static, overall gray, worst quality, low quality, JPEG compression residue, ugly, incomplete, extra fingers, poorly drawn hands, deformed, disfigured, misshapen limbs, watermark, text",
        duration,
        1.0, // guidance_scale
        4,   // steps (fast distilled Wan 2.1)
        Math.floor(Math.random() * 1000000), // random seed
        true, // randomize_seed
      ]);

      if (!result?.data || !result.data[0]) {
        throw new Error("No video returned from Wan 2.1 generator");
      }

      // result.data[0] contains the video file info
      const videoData = result.data[0];
      const remoteVideoUrl = videoData.video?.url || videoData.url || (typeof videoData === "string" ? videoData : null);

      if (!remoteVideoUrl) {
        throw new Error("Invalid video payload received from model");
      }

      // Download and save locally in uploads/videos
      const outputDir = path.resolve(process.cwd(), "uploads", "videos", videoId);
      await fs.mkdir(outputDir, { recursive: true });
      const localVideoFile = path.join(outputDir, "runway.mp4");

      const videoRes = await fetch(remoteVideoUrl);
      if (!videoRes.ok) {
        throw new Error(`Failed to download rendered video file: ${videoRes.statusText}`);
      }
      const videoBuffer = await videoRes.arrayBuffer();
      await fs.writeFile(localVideoFile, Buffer.from(videoBuffer));

      const finalVideoUrl = `/uploads/videos/${videoId}/runway.mp4`;

      logger.info({ videoId, finalVideoUrl }, "AI Video Try-On generation completed successfully");

      return {
        id: videoId,
        videoUrl: finalVideoUrl,
        thumbnailUrl: input.imageUrl,
        aspectRatio,
        durationSeconds: duration,
        motionStyle,
        prompt,
        createdAt: new Date().toISOString(),
      };
    } catch (err: any) {
      logger.error({ videoId, err: err.message }, "AI Video Try-On generation failed");
      throw new AppError("VIDEO_GENERATION_FAILED", `Failed to generate video: ${err.message}`, 502);
    }
  }
}

export const videoGenerationService = new VideoGenerationService();
