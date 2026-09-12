import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../auth/middleware/auth.middleware.js";
import { authService } from "../auth/auth.service.js";
import { membershipService } from "../membership/membership.service.js";
import { paymentService } from "../payments/payment.service.js";
import { notificationService } from "../admin/notification.service.js";
import { prisma } from "../config/prisma.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.getMe(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get("/membership", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await membershipService.getUserMembership(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get("/usage", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(200).json({ success: true, data: [] });
    }
    const usages = await prisma.generationUsage.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.status(200).json({ success: true, data: usages });
  } catch (err) {
    next(err);
  }
});

router.get("/payments", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await paymentService.getMyVerifications(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get("/notifications", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(200).json({ success: true, data: [] });
    }
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      take: 25,
    });
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
});

router.put("/notifications/:id/read", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await notificationService.markAsRead(req.params.id, req.user!.id);
    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    next(err);
  }
});

export const meRoutes = router;
