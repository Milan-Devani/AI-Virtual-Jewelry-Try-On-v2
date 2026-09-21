import { Router } from "express";
import { photoshootController } from "../controllers/photoshoot.controller.js";
import { singleImageUpload } from "../middleware/upload.js";
import { aiGenerationLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// POST /api/photoshoot/generate
router.post(
  "/generate",
  aiGenerationLimiter,
  (req, res, next) => {
    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      return singleImageUpload(req, res, next);
    }
    next();
  },
  photoshootController.generate.bind(photoshootController)
);

export { router as photoshootRouter };
