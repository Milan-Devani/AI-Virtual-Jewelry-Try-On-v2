import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";
import { mockStore } from "../../mock/mockStore.js";
import { AppError } from "../../utils/errors.js";

export interface ActiveMembershipData {
  subscriptionId: string;
  planId: string;
  planName: string;
  generationLimit: number;
  usedCredits: number;
  remainingCredits: number;
  periodStart: Date;
  periodEnd: Date | null;
}

declare global {
  namespace Express {
    interface Request {
      membership?: ActiveMembershipData;
    }
  }
}

export async function requireActiveMembership(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError("AUTH_REQUIRED", "Authentication is required.", 401);
    }

    // Admin accounts bypass membership checks for testing/supervision
    if (req.user.role === "ADMIN") {
      req.membership = {
        subscriptionId: "admin-unlimited",
        planId: "plan-business",
        planName: "Admin VIP Unlimited",
        generationLimit: 99999,
        usedCredits: 0,
        remainingCredits: 99999,
        periodStart: new Date(),
        periodEnd: null,
      };
      return next();
    }

    // Offline / Mock fallback when DATABASE_URL is not configured
    if (!process.env.DATABASE_URL) {
      const mockUser = mockStore.users.find(
        (u) => u.id === req.user!.id || u.email === req.user!.email
      );
      const isSuperAdmin =
        req.user.id === "admin-default-id" ||
        req.user.id.includes("admin") ||
        mockUser?.role === "ADMIN";
      const isSubActive = isSuperAdmin || Boolean(mockUser?.hasActivePlan);

      if (!isSubActive) {
        // Check if there is a pending verification
        const pendingVerification = mockStore.verifications.find(
          (v) =>
            (v.userId === req.user!.id || (mockUser && v.userId === mockUser.id)) &&
            v.status === "pending"
        );

        if (pendingVerification) {
          throw new AppError(
            "MEMBERSHIP_PENDING",
            "Your payment is currently pending admin verification. AI try-on generation will be enabled once approved.",
            403,
            { status: "pending_verification" }
          );
        }

        throw new AppError(
          "MEMBERSHIP_REQUIRED",
          "An active membership plan is required to generate AI virtual try-ons. Please subscribe to a plan.",
          403,
          { status: "inactive", upgradeUrl: "/pricing" }
        );
      }

      const planName = isSuperAdmin ? "Administrator VIP" : mockUser?.planName || "Professional";
      const generationLimit = isSuperAdmin ? 99999 : mockUser?.generationLimit || 150;
      const usedCredits = mockUser?.totalGenerations || 0;

      req.membership = {
        subscriptionId: `sub-mock-${req.user.id}`,
        planId: "plan-mock",
        planName,
        generationLimit,
        usedCredits,
        remainingCredits: Math.max(0, generationLimit - usedCredits),
        periodStart: new Date(0),
        periodEnd: null,
      };

      return next();
    }

    const sub = await prisma.subscription.findFirst({
      where: {
        userId: req.user.id,
        status: "active",
      },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });

    if (!sub || !sub.plan) {
      // Check if there is a pending verification
      const pendingVerification = await prisma.paymentVerification.findFirst({
        where: { userId: req.user.id, status: "pending" },
      });

      if (pendingVerification) {
        throw new AppError(
          "MEMBERSHIP_PENDING",
          "Your payment is currently pending admin verification. AI try-on generation will be enabled once approved.",
          403,
          { status: "pending_verification" }
        );
      }

      throw new AppError(
        "MEMBERSHIP_REQUIRED",
        "An active membership plan is required to generate AI virtual try-ons. Please subscribe to a plan.",
        403,
        { status: "inactive", upgradeUrl: "/pricing" }
      );
    }

    // Check expiration date
    if (sub.currentPeriodEnd && new Date(sub.currentPeriodEnd) < new Date()) {
      // Auto-update to expired
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { status: "expired" },
      });

      throw new AppError(
        "MEMBERSHIP_EXPIRED",
        "Your subscription plan has expired. Please renew to continue generating virtual try-ons.",
        403,
        { status: "expired", upgradeUrl: "/pricing" }
      );
    }

    // Attach basic info
    req.membership = {
      subscriptionId: sub.id,
      planId: sub.plan.id,
      planName: sub.plan.name,
      generationLimit: sub.plan.generationLimit,
      usedCredits: 0,
      remainingCredits: sub.plan.generationLimit,
      periodStart: sub.currentPeriodStart || new Date(0),
      periodEnd: sub.currentPeriodEnd,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export function requireCredits(creditsNeeded: number = 1) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.membership) {
        throw new AppError("MEMBERSHIP_REQUIRED", "Active membership check required.", 403);
      }

      if (req.user.role === "ADMIN") {
        return next();
      }

      if (!process.env.DATABASE_URL) {
        const mockUser = mockStore.users.find(
          (u) => u.id === req.user!.id || u.email === req.user!.email
        );
        const limit = req.membership.generationLimit;
        const used = mockUser?.totalGenerations ?? req.membership.usedCredits ?? 0;
        const remaining = Math.max(0, limit - used);

        req.membership.usedCredits = used;
        req.membership.remainingCredits = remaining;

        if (remaining < creditsNeeded) {
          throw new AppError(
            "LIMIT_EXCEEDED",
            `You need ${creditsNeeded} credit${creditsNeeded > 1 ? "s" : ""} for this generation, but you have ${remaining} credit${remaining === 1 ? "" : "s"} remaining. Please upgrade your plan for additional credits.`,
            403,
            {
              limit,
              used,
              remaining,
              needed: creditsNeeded,
              upgradeUrl: "/pricing",
            }
          );
        }

        return next();
      }

      const { periodStart, generationLimit } = req.membership;

      const countResult = await prisma.generationUsage.aggregate({
        where: {
          userId: req.user.id,
          status: "success",
          createdAt: { gte: periodStart },
        },
        _sum: { creditsUsed: true },
      });

      const used = countResult._sum.creditsUsed || 0;
      const remaining = Math.max(0, generationLimit - used);

      req.membership.usedCredits = used;
      req.membership.remainingCredits = remaining;

      if (remaining < creditsNeeded) {
        throw new AppError(
          "LIMIT_EXCEEDED",
          `You need ${creditsNeeded} credit${creditsNeeded > 1 ? "s" : ""} for this generation, but you have ${remaining} credit${remaining === 1 ? "" : "s"} remaining. Please upgrade your plan for additional credits.`,
          403,
          {
            limit: generationLimit,
            used,
            remaining,
            needed: creditsNeeded,
            upgradeUrl: "/pricing",
          }
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export const requireGenerationCredit = requireCredits(1);

