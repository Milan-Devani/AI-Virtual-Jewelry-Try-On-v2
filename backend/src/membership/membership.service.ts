import { prisma } from "../config/prisma.js";
import { mockStore } from "../mock/mockStore.js";
import { AppError } from "../utils/errors.js";

export class MembershipService {
  async getPublicPlans() {
    if (!process.env.DATABASE_URL) {
      return mockStore.plans;
    }

    const plans = await prisma.membershipPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return plans;
  }

  async getUserMembership(userId: string) {
    if (!process.env.DATABASE_URL) {
      const mockUser = mockStore.users.find((u) => u.id === userId);
      const isSuperAdmin = userId === "admin-default-id" || userId.includes("admin") || mockUser?.role === "ADMIN";
      const isSubActive = isSuperAdmin || Boolean(mockUser?.hasActivePlan);
      const planName = isSuperAdmin ? "Administrator VIP" : (mockUser?.planName || "Starter");
      const credits = isSuperAdmin ? 99999 : (mockUser?.generationLimit || (isSubActive ? 150 : 0));

      return {
        subscription: isSubActive
          ? {
              id: "sub-mock",
              status: "active",
              plan: { id: "plan-mock", name: planName, generationLimit: credits },
            }
          : null,
        status: isSubActive ? "active" : (mockUser?.status || "inactive"),
        pendingVerification: mockStore.verifications.find((v) => v.userId === userId && v.status === "pending") || null,
        plan: isSubActive ? { id: "plan-mock", name: planName, generationLimit: credits } : null,
        totalCredits: credits,
        usedCredits: mockUser?.totalGenerations || 0,
        remainingCredits: Math.max(0, credits - (mockUser?.totalGenerations || 0)),
        isActive: isSubActive,
      };
    }

    const sub = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { plan: true },
    });

    const pendingVerification = await prisma.paymentVerification.findFirst({
      where: { userId, status: "pending" },
      orderBy: { createdAt: "desc" },
      include: { plan: true },
    });

    let remainingCredits = 0;
    let usedCredits = 0;
    let totalCredits = 0;

    if (sub && sub.status === "active" && sub.plan) {
      totalCredits = sub.plan.generationLimit;
      const periodStart = sub.currentPeriodStart || new Date(0);

      const usage = await prisma.generationUsage.aggregate({
        where: {
          userId,
          status: "success",
          createdAt: { gte: periodStart },
        },
        _sum: { creditsUsed: true },
      });

      usedCredits = usage._sum.creditsUsed || 0;
      remainingCredits = Math.max(0, totalCredits - usedCredits);
    }

    return {
      subscription: sub,
      status: sub ? sub.status : (pendingVerification ? "pending_verification" : "inactive"),
      pendingVerification,
      plan: sub?.plan || pendingVerification?.plan || null,
      totalCredits,
      usedCredits,
      remainingCredits,
      isActive: sub?.status === "active" && (!sub.currentPeriodEnd || new Date(sub.currentPeriodEnd) > new Date()),
    };
  }

  async cancelSubscription(userId: string) {
    if (!process.env.DATABASE_URL) {
      const mockUser = mockStore.users.find((u) => u.id === userId);
      if (!mockUser || !mockUser.hasActivePlan) {
        throw new AppError("NOT_FOUND", "No active subscription found to cancel.", 404);
      }
      mockUser.hasActivePlan = false;
      mockUser.activePlanLabel = "FALSE";
      mockUser.status = "cancelled";
      return { id: `sub-${userId}`, status: "cancelled" };
    }

    const sub = await prisma.subscription.findFirst({
      where: { userId, status: "active" },
    });

    if (!sub) {
      throw new AppError("NOT_FOUND", "No active subscription found to cancel.", 404);
    }

    const updated = await prisma.subscription.update({
      where: { id: sub.id },
      data: { cancelAtPeriodEnd: true },
    });

    return updated;
  }

  async deductCredits(params: {
    userId: string;
    amount: number;
    category?: string;
    mode?: string;
    generationId?: string;
    outputUrl?: string;
    prompt?: string;
    inputModelUrl?: string;
    inputJewelryUrl?: string;
    modelConfig?: any;
  }): Promise<{
    totalCredits: number;
    usedCredits: number;
    remainingCredits: number;
    deducted: number;
  }> {
    const { userId, amount = 1 } = params;

    if (!userId || userId === "anonymous") {
      return { totalCredits: 0, usedCredits: 0, remainingCredits: 0, deducted: 0 };
    }

    if (!process.env.DATABASE_URL) {
      const mockUser = mockStore.users.find((u) => u.id === userId || u.email === userId);
      const isSuperAdmin =
        userId === "admin-default-id" || userId.includes("admin") || mockUser?.role === "ADMIN";
      const limit = isSuperAdmin ? 99999 : (mockUser?.generationLimit || (mockUser?.hasActivePlan ? 150 : 0));

      if (mockUser) {
        mockUser.totalGenerations = (mockUser.totalGenerations || 0) + amount;
      }

      const usedCredits = mockUser?.totalGenerations || 0;
      const remainingCredits = isSuperAdmin ? 99999 : Math.max(0, limit - usedCredits);

      return {
        totalCredits: limit,
        usedCredits,
        remainingCredits,
        deducted: amount,
      };
    }

    // Database mode
    let userRecord = null;
    try {
      userRecord = await prisma.user.findUnique({ where: { id: userId } });
    } catch {}

    const isSuperAdmin =
      userRecord?.role === "ADMIN" || userId.includes("admin") || userId === "admin-default-id";

    // 1. Record generation usage
    try {
      await prisma.generationUsage.create({
        data: {
          id: params.generationId || undefined,
          userId,
          category: params.category || "AI Generation",
          mode: params.mode || "generation",
          modelConfig: params.modelConfig ? (params.modelConfig as any) : undefined,
          prompt: params.prompt,
          inputModelUrl: params.inputModelUrl,
          inputJewelryUrl: params.inputJewelryUrl,
          outputImageUrl: params.outputUrl || "",
          status: "success",
          creditsUsed: amount,
        },
      });
    } catch {
      // If record already exists by ID, update it
      try {
        if (params.generationId) {
          await prisma.generationUsage.update({
            where: { id: params.generationId },
            data: {
              status: "success",
              creditsUsed: amount,
              outputImageUrl: params.outputUrl || undefined,
            },
          });
        }
      } catch {}
    }

    if (isSuperAdmin) {
      return {
        totalCredits: 99999,
        usedCredits: 0,
        remainingCredits: 99999,
        deducted: amount,
      };
    }

    // Get active subscription and calculate period usage
    const sub = await prisma.subscription.findFirst({
      where: { userId, status: "active" },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });

    const periodStart = sub?.currentPeriodStart || new Date(0);
    const totalCredits = sub?.plan?.generationLimit || 0;

    const usage = await prisma.generationUsage.aggregate({
      where: {
        userId,
        status: "success",
        createdAt: { gte: periodStart },
      },
      _sum: { creditsUsed: true },
    });

    const usedCredits = usage._sum.creditsUsed || 0;
    const remainingCredits = Math.max(0, totalCredits - usedCredits);

    return {
      totalCredits,
      usedCredits,
      remainingCredits,
      deducted: amount,
    };
  }
}

export const membershipService = new MembershipService();

