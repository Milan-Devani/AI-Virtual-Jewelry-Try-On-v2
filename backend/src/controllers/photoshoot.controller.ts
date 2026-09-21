import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { photoshootService } from "../services/photoshoot.service.js";
import { ValidationError, AppError } from "../utils/errors.js";
import { ApiSuccessResponse } from "../types/index.js";

const generatePhotoshootSchema = z.object({
  category: z.string().optional().default("Jewelry"),
  theme: z
    .enum(["luxury-studio", "royal-bridal", "minimal-white", "dark-editorial"])
    .optional()
    .default("luxury-studio"),
  aspectRatio: z.enum(["4:5", "1:1", "16:9"]).optional().default("4:5"),
  imageUrl: z.string().optional(),
});

export class PhotoshootController {
  async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = generatePhotoshootSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.errors[0]?.message || "Invalid photoshoot parameters",
          "INVALID_SETTINGS",
          parsed.error.format()
        );
      }

      let jewelryBuffer: Buffer;
      let jewelryMime = "image/jpeg";

      // 1. Direct file upload via multer
      if (req.file) {
        jewelryBuffer = req.file.buffer;
        jewelryMime = req.file.mimetype;
      }
      // 2. Existing image URL provided in body
      else if (parsed.data.imageUrl) {
        const url = parsed.data.imageUrl;
        if (url.startsWith("http://") || url.startsWith("https://")) {
          // Check if it points to local server uploads
          if (url.includes("/uploads/")) {
            const rel = url.split("/uploads/")[1];
            const localFile = path.resolve(process.cwd(), "uploads", rel);
            try {
              jewelryBuffer = await fs.readFile(localFile);
              jewelryMime = localFile.endsWith(".png") ? "image/png" : "image/jpeg";
            } catch {
              const fetchRes = await fetch(url);
              if (!fetchRes.ok) throw new AppError("INVALID_IMAGE", "Could not fetch jewelry image", 400);
              jewelryBuffer = Buffer.from(await fetchRes.arrayBuffer());
            }
          } else {
            const fetchRes = await fetch(url);
            if (!fetchRes.ok) throw new AppError("INVALID_IMAGE", "Could not fetch jewelry image", 400);
            jewelryBuffer = Buffer.from(await fetchRes.arrayBuffer());
          }
        } else {
          // Local path
          const cleanPath = url.replace(/^\//, "");
          const localPath = path.resolve(process.cwd(), cleanPath);
          jewelryBuffer = await fs.readFile(localPath);
        }
      } else {
        throw new ValidationError(
          "Please upload a jewelry product image to generate your photoshoot set.",
          "JEWELRY_IMAGE_INVALID"
        );
      }

      const result = await photoshootService.generatePhotoshoot({
        jewelryBuffer,
        jewelryMime,
        category: parsed.data.category,
        theme: parsed.data.theme,
        aspectRatio: parsed.data.aspectRatio,
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

export const photoshootController = new PhotoshootController();
