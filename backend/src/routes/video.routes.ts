import { Router } from "express";
import { videoController } from "../controllers/video.controller.js";
import { singleImageUpload } from "../middleware/upload.js";
import { aiGenerationLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// POST /api/video/generate
router.post(
  "/generate",
  aiGenerationLimiter,
  (req, res, next) => {
    // If multipart/form-data, process singleImageUpload middleware
    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      return singleImageUpload(req, res, next);
    }
    next();
  },
  (req, res, next) => {
    videoController.generate(req, res, next);
  }
);

export { router as videoRouter };
