import { Router } from "express";
import { videoController } from "../controllers/video.controller.js";
import { aiGenerationLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// POST /api/video/generate
router.post("/generate", aiGenerationLimiter, (req, res, next) => {
  videoController.generate(req, res, next);
});

export { router as videoRouter };
