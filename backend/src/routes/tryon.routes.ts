import { Router } from "express";
import { tryOnController } from "../controllers/tryon.controller.js";
import { tryOnUpload, singleImageUpload } from "../middleware/upload.js";
import { aiGenerationLimiter } from "../middleware/rateLimiter.js";
import { requireAuth } from "../auth/middleware/auth.middleware.js";
import {
  requireActiveMembership,
  requireGenerationCredit,
} from "../membership/middleware/membership.middleware.js";

const router = Router();

// Primary Try-On Generation (Protected by Auth, Active Membership, and Credit Limits)
router.post(
  "/ai-jewelry/generate",
  requireAuth,
  requireActiveMembership,
  requireGenerationCredit,
  aiGenerationLimiter,
  tryOnUpload,
  tryOnController.generate.bind(tryOnController)
);

// Standard /api/try-on route
router.post(
  "/",
  requireAuth,
  requireActiveMembership,
  requireGenerationCredit,
  aiGenerationLimiter,
  tryOnUpload,
  tryOnController.generate.bind(tryOnController)
);

// Standalone Pre-Validation Endpoints
router.post(
  "/ai-jewelry/validate-model",
  singleImageUpload,
  tryOnController.validateModel.bind(tryOnController)
);

router.post(
  "/ai-jewelry/validate-product",
  singleImageUpload,
  tryOnController.validateProduct.bind(tryOnController)
);

// History & Lifecycle Endpoints
router.get("/ai-jewelry/history", tryOnController.getHistory.bind(tryOnController));
router.get("/ai-jewelry/:id", tryOnController.getById.bind(tryOnController));
router.delete("/ai-jewelry/:id", requireAuth, tryOnController.deleteById.bind(tryOnController));

export default router;
