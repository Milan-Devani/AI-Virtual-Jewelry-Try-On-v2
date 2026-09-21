import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { videoGenerationService } from "../services/video-generation.service.js";
import { ValidationError } from "../utils/errors.js";
import { ApiSuccessResponse } from "../types/index.js";

const generateVideoSchema = z.object({
  imageUrl: z.string().min(1, "Image or uploaded file is required"),
  category: z.string().optional().default("jewelry"),
  aspectRatio: z.enum(["9:16", "4:5", "16:9", "1:1"]).optional().default("9:16"),
  motionStyle: z.enum(["head-turn", "editorial-smile", "subtle-sparkle", "runway-pose"]).optional().default("head-turn"),
  durationSeconds: z.coerce.number().min(2).max(5).optional().default(3),
});

export class VideoController {
  async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let imageUrl = req.body?.imageUrl;

      // Handle direct file upload via multipart/form-data
      if (req.file) {
        const ext = req.file.mimetype.includes("png")
          ? ".png"
          : req.file.mimetype.includes("webp")
          ? ".webp"
          : ".jpg";
        const filename = `direct_${Date.now()}_${Math.floor(Math.random() * 10000)}${ext}`;
        const tempDir = path.resolve(process.cwd(), "uploads", "temp");
        await fs.mkdir(tempDir, { recursive: true });
        const tempPath = path.join(tempDir, filename);
        await fs.writeFile(tempPath, req.file.buffer);
        imageUrl = `/uploads/temp/${filename}`;
      }

      const parsed = generateVideoSchema.safeParse({
        ...req.body,
        imageUrl,
      });

      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.errors[0]?.message || "Invalid video parameters",
          "INVALID_VIDEO_PARAMS",
          parsed.error.format()
        );
      }

      const result = await videoGenerationService.generateVideo({
        ...parsed.data,
        userId: (req as any).user?.id,
      });

      const response: ApiSuccessResponse<typeof result> = {
        success: true,
        data: result,
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}

export const videoController = new VideoController();
