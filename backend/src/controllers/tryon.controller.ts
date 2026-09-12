import { Request, Response, NextFunction } from "express";
import { tryOnService } from "../services/tryon.service.js";
import { tryonParamsSchema } from "../validators/tryonValidator.js";
import { validateUploadedImage } from "../validators/imageValidator.js";
import { ValidationError } from "../utils/errors.js";
import { ApiSuccessResponse } from "../types/index.js";

export class TryOnController {
  async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      const modelFile = files?.modelImage?.[0];
      const jewelryFile = files?.jewelryImage?.[0];

      const parsedParams = tryonParamsSchema.safeParse(req.body);
      if (!parsedParams.success) {
        const firstError = parsedParams.error.errors[0]?.message || "Invalid input parameters.";
        throw new ValidationError(firstError, "INVALID_SETTINGS", parsedParams.error.format());
      }

      const rawMode = req.body?.mode || parsedParams.data.mode;
      const isAiModelMode = rawMode === "ai-model" || (!modelFile && !!jewelryFile);

      if (!isAiModelMode && !modelFile) {
        throw new ValidationError("Please upload a human model image.", "MODEL_IMAGE_INVALID");
      }

      if (!jewelryFile) {
        throw new ValidationError("Please upload a jewelry product image.", "JEWELRY_IMAGE_INVALID");
      }

      let modelConfigObj = undefined;
      if (parsedParams.data.modelConfig) {
        if (typeof parsedParams.data.modelConfig === "string") {
          try {
            modelConfigObj = JSON.parse(parsedParams.data.modelConfig);
          } catch {
            modelConfigObj = undefined;
          }
        } else {
          modelConfigObj = parsedParams.data.modelConfig;
        }
      }

      const activeMode = isAiModelMode ? "ai-model" : "custom-model";

      const result = await tryOnService.generateTryOn({
        modelImage: modelFile,
        jewelryImage: jewelryFile,
        mode: activeMode,
        modelConfig: modelConfigObj,
        category: parsedParams.data.category,
        customCategoryName: parsedParams.data.customCategoryName,
        customPlacement: parsedParams.data.customPlacement,
        background: parsedParams.data.background,
        aspectRatio: parsedParams.data.aspectRatio,
        imageSize: parsedParams.data.imageSize,
        userId: req.user?.id || parsedParams.data.userId || "anonymous",
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

  async validateModel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        throw new ValidationError("No model image provided to validate.", "MODEL_IMAGE_INVALID");
      }

      const result = await validateUploadedImage(file, "model");
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async validateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        throw new ValidationError("No jewelry image provided to validate.", "JEWELRY_IMAGE_INVALID");
      }

      const result = await validateUploadedImage(file, "jewelry");
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req.query.userId as string) || "anonymous";
      const category = req.query.category as string | undefined;

      const history = await tryOnService.listHistory(userId, category);
      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const record = await tryOnService.getGenerationById(id);
      res.status(200).json({
        success: true,
        data: record,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await tryOnService.deleteGeneration(id);
      res.status(200).json({
        success: true,
        data: { id, deleted: true },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const tryOnController = new TryOnController();
