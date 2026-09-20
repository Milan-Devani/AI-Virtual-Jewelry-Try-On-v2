import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { videoGenerationService } from "../services/video-generation.service.js";
import { ValidationError } from "../utils/errors.js";
import { ApiSuccessResponse } from "../types/index.js";

const generateVideoSchema = z.object({
  imageUrl: z.string().min(1, "Image URL is required"),
  category: z.string().optional().default("jewelry"),
  aspectRatio: z.enum(["9:16", "4:5", "16:9", "1:1"]).optional().default("9:16"),
  motionStyle: z.enum(["head-turn", "editorial-smile", "subtle-sparkle", "runway-pose"]).optional().default("head-turn"),
  durationSeconds: z.number().min(2).max(5).optional().default(3),
});

export class VideoController {
  async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = generateVideoSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.errors[0]?.message || "Invalid video parameters",
          "INVALID_VIDEO_PARAMS",
          parsed.error.format()
        );
      }

      const result = await videoGenerationService.generateVideo(parsed.data);

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
