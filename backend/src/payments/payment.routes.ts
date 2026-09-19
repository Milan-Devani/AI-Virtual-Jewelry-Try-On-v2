import { Router } from "express";
import multer from "multer";
import { paymentController } from "./payment.controller.js";
import { requireAuth } from "../auth/middleware/auth.middleware.js";
import { config } from "../config/index.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.maxPaymentScreenshotBytes || 5 * 1024 * 1024,
  },
});

const router = Router();

// Protected payment flow
router.get("/upi-details/:planId", requireAuth, (req, res, next) =>
  paymentController.getUpiDetails(req, res, next)
);

router.post(
  "/submit-verification",
  requireAuth,
  upload.single("screenshot") as any,
  (req, res, next) => paymentController.submitVerification(req, res, next)
);

router.get("/my-verifications", requireAuth, (req, res, next) =>
  paymentController.getMyVerifications(req, res, next)
);

export const paymentRoutes = router;
