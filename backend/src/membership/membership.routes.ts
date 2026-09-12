import { Router } from "express";
import { membershipController } from "./membership.controller.js";
import { requireAuth } from "../auth/middleware/auth.middleware.js";

const router = Router();

// Public plan listing
router.get("/plans", (req, res, next) => membershipController.getPlans(req, res, next));

// Protected user membership endpoints
router.get("/me", requireAuth, (req, res, next) => membershipController.getMyMembership(req, res, next));
router.post("/cancel", requireAuth, (req, res, next) => membershipController.cancelMembership(req, res, next));

export const membershipRoutes = router;
