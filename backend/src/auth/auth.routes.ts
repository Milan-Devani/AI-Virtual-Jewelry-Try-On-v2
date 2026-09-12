import { Router } from "express";
import { authController } from "./auth.controller.js";
import { requireAuth } from "./middleware/auth.middleware.js";

const router = Router();

// Public auth endpoints
router.post("/register", (req, res, next) => authController.register(req, res, next));
router.post("/login", (req, res, next) => authController.login(req, res, next));
router.post("/logout", (req, res) => authController.logout(req, res));

export const authRoutes = router;
export { requireAuth };
