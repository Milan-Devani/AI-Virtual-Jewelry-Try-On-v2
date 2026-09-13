import { prisma } from "../config/prisma.js";
import { mockStore } from "../mock/mockStore.js";
import { AppError } from "../utils/errors.js";
import { auditService } from "./audit.service.js";

export class AdminService {
  async getDashboardStats() {
    if (!process.env.DATABASE_URL) {
      const totalUsers = mockStore.users.filter((u) => u.role === "USER").length;
      const activeSubscriptions = mockStore.users.filter((u) => u.hasActivePlan && u.role === "USER").length;
      const pendingVerifications = mockStore.verifications.filter((v) => v.status === "pending").length;
      const totalRevenue = mockStore.verifications
        .filter((v) => v.status === "approved")
        .reduce((sum, v) => sum + v.amount, 0);

      return {
        overview: {
          totalUsers,
          activeSubscriptions,
          pendingVerifications,
          totalTryOns: 242,
          totalRevenueINR: totalRevenue,
        },
        recentVerifications: mockStore.verifications.slice(0, 5),
        recentTryOns: [
          {
            id: "tryon-01",
            category: "Necklaces",
            status: "success",
            createdAt: new Date(),
            user: { name: "Ananya Sharma", email: "ananya.sharma@tanishq-partner.com" },
          },
          {
            id: "tryon-02",
            category: "Earrings",
            status: "success",
            createdAt: new Date(Date.now() - 3600000),
            user: { name: "Priya Nair", email: "priya.nair@kalyanjewellers-demo.com" },
          },
        ],
        categoryBreakdown: [
          { category: "Earrings", count: 92 },
          { category: "Necklaces", count: 71 },
          { category: "Rings", count: 50 },
          { category: "Jewelry Sets & Bridal", count: 29 },
        ],
      };
    }

    const [
      totalUsers,
      activeSubscriptionsCount,
      pendingVerificationsCount,
      totalTryOnsCount,
      revenueResult,
      recentVerifications,
      recentTryOns,
      categoryStats,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.subscription.count({
        where: {
          status: "active",
          OR: [{ currentPeriodEnd: null }, { currentPeriodEnd: { gt: new Date() } }],
        },
      }),
      prisma.paymentVerification.count({ where: { status: "pending" } }),
      prisma.generationUsage.count({ where: { status: "success" } }),
      prisma.paymentVerification.aggregate({
        where: { status: "approved" },
        _sum: { amount: true },
      }),
      prisma.paymentVerification.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } }, plan: true },
      }),
      prisma.generationUsage.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      }),
      prisma.generationUsage.groupBy({
        by: ["category"],
        _count: { category: true },
        where: { status: "success" },
      }),
    ]);

    const totalRevenue = revenueResult._sum.amount || 0;

    return {
      overview: {
        totalUsers,
        activeSubscriptions: activeSubscriptionsCount,
        pendingVerifications: pendingVerificationsCount,
        totalTryOns: totalTryOnsCount,
        totalRevenueINR: totalRevenue,
      },
      recentVerifications,
      recentTryOns,
      categoryBreakdown: categoryStats.map((c) => ({
        category: c.category,
        count: c._count.category,
      })),
    };
  }

  async getUsers(params: {
    search?: string;
    filter?: string; // "all" | "active" | "pending" | "none" | "expired" | "rejected"
    page?: number;
    limit?: number;
  }) {
    if (!process.env.DATABASE_URL) {
      let filtered = [...mockStore.users];
      if (params.search) {
        const q = params.search.toLowerCase().trim();
        filtered = filtered.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
      }
      if (params.filter === "active") {
        filtered = filtered.filter((u) => u.hasActivePlan);
      } else if (params.filter === "pending") {
        filtered = filtered.filter((u) => u.status === "pending_verification");
      } else if (params.filter === "none") {
        filtered = filtered.filter((u) => !u.hasActivePlan && u.status === "no_plan");
      }
      const total = filtered.length;
      const page = Math.max(1, params.page || 1);
      const limit = Math.max(1, params.limit || 20);
      const users = filtered.slice((page - 1) * limit, page * limit);
      return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 20);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      where.OR = [
        { email: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
      ];
    }

    if (params.filter === "active") {
      where.subscriptions = {
        some: {
          status: "active",
          OR: [{ currentPeriodEnd: null }, { currentPeriodEnd: { gt: new Date() } }],
        },
      };
    } else if (params.filter === "pending") {
      where.paymentVerifications = {
        some: { status: "pending" },
      };
    } else if (params.filter === "expired") {
      where.subscriptions = {
        some: { status: "expired" },
      };
    } else if (params.filter === "none") {
      where.subscriptions = {
        none: {},
      };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          subscriptions: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: { plan: true },
          },
          paymentVerifications: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: {
            select: { generationUsages: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Map formatted rows for the Admin Users table
    const formattedUsers = users.map((u) => {
      const latestSub = u.subscriptions[0] || null;
      const latestVerification = u.paymentVerifications[0] || null;

      const isSubActive =
        latestSub?.status === "active" &&
        (!latestSub.currentPeriodEnd || new Date(latestSub.currentPeriodEnd) > new Date());

      let status = "no_plan";
      if (isSubActive) {
        status = "active";
      } else if (latestVerification?.status === "pending") {
        status = "pending_verification";
      } else if (latestSub?.status === "expired") {
        status = "expired";
      } else if (latestVerification?.status === "rejected") {
        status = "rejected";
      }

      return {
        id: u.id,
        name: u.name || "Anonymous",
        firstName: u.firstName,
        lastName: u.lastName,
        phoneNumber: u.phoneNumber,
        email: u.email,
        role: u.role,
        status, // "active" | "pending_verification" | "expired" | "rejected" | "no_plan"
        planName: latestSub?.plan?.name || "None",
        planPrice: latestSub?.plan?.price || 0,
        // CRITICAL ADMIN REQUIREMENT: Clear boolean indicator for active plan
        hasActivePlan: isSubActive,
        activePlanLabel: isSubActive ? "TRUE" : "FALSE",
        generationLimit: latestSub?.plan?.generationLimit || 0,
        totalGenerations: u._count.generationUsages,
        createdAt: u.createdAt,
      };
    });

    return {
      users: formattedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserDetail(userId: string) {
    if (!process.env.DATABASE_URL) {
      const user = mockStore.users.find((u) => u.id === userId);
      if (!user) throw new AppError("NOT_FOUND", "User not found.", 404);
      return {
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        subscriptions: user.hasActivePlan
          ? [
              {
                id: "sub-1",
                status: "active",
                plan: { name: user.planName, price: user.planPrice, generationLimit: user.generationLimit },
              },
            ]
          : [],
        paymentVerifications: mockStore.verifications.filter((v) => v.userId === userId),
        generationUsages: [],
        notifications: [],
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          include: { plan: true },
        },
        paymentVerifications: {
          orderBy: { createdAt: "desc" },
          include: { plan: true },
        },
        generationUsages: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        notifications: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!user) {
      throw new AppError("NOT_FOUND", "User not found.", 404);
    }

    return user;
  }

  async getUserUsage(userId: string) {
    if (!process.env.DATABASE_URL) {
      return [];
    }
    const usages = await prisma.generationUsage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return usages;
  }


  async grantMembership(params: {
    userId: string;
    planId: string;
    durationDays?: number;
    adminId: string;
  }) {
    if (!process.env.DATABASE_URL) {
      const user = mockStore.users.find((u) => u.id === params.userId);
      const plan = mockStore.plans.find((p) => p.id === params.planId) || mockStore.plans[0];
      if (user) {
        user.hasActivePlan = true;
        user.activePlanLabel = "TRUE";
        user.planName = plan.name;
        user.planPrice = plan.price;
        user.generationLimit = plan.generationLimit;
        user.status = "active";
      }
      return { id: `sub-granted-${Date.now()}`, status: "active" };
    }

    const plan = await prisma.membershipPlan.findUnique({
      where: { id: params.planId },
    });
    if (!plan) throw new AppError("NOT_FOUND", "Plan not found", 404);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (params.durationDays || 30));

    const existingSub = await prisma.subscription.findFirst({
      where: { userId: params.userId },
      orderBy: { createdAt: "desc" },
    });

    let sub;
    if (existingSub) {
      sub = await prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          planId: plan.id,
          status: "active",
          currentPeriodStart: startDate,
          currentPeriodEnd: endDate,
          cancelAtPeriodEnd: false,
        },
      });
    } else {
      sub = await prisma.subscription.create({
        data: {
          userId: params.userId,
          planId: plan.id,
          status: "active",
          currentPeriodStart: startDate,
          currentPeriodEnd: endDate,
        },
      });
    }

    await prisma.notification.create({
      data: {
        userId: params.userId,
        title: "💎 Membership Granted",
        message: `An administrator has activated your ${plan.name} membership with ${plan.generationLimit} credits.`,
        type: "success",
      },
    });

    await auditService.log({
      adminId: params.adminId,
      action: "GRANT_MEMBERSHIP",
      targetType: "User",
      targetId: params.userId,
      details: { planId: plan.id, planName: plan.name, durationDays: params.durationDays || 30 },
    });

    return sub;
  }

  async revokeMembership(userId: string, adminId: string, reason?: string) {
    if (!process.env.DATABASE_URL) {
      const user = mockStore.users.find((u) => u.id === userId);
      if (user) {
        user.hasActivePlan = false;
        user.activePlanLabel = "FALSE";
        user.planName = "None";
        user.status = "no_plan";
      }
      return { id: "sub-revoked", status: "cancelled" };
    }

    const sub = await prisma.subscription.findFirst({
      where: { userId, status: "active" },
    });

    if (!sub) {
      throw new AppError("NOT_FOUND", "No active subscription found to revoke.", 404);
    }

    const updated = await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: "cancelled" },
    });

    await prisma.notification.create({
      data: {
        userId,
        title: "Membership Status Update",
        message: `Your active membership has been revoked by an administrator. Reason: ${
          reason || "Administrative review"
        }`,
        type: "warning",
      },
    });

    await auditService.log({
      adminId,
      action: "REVOKE_MEMBERSHIP",
      targetType: "User",
      targetId: userId,
      details: { subscriptionId: sub.id, reason },
    });

    return updated;
  }

  // Plans Management
  async getPlans() {
    if (!process.env.DATABASE_URL) {
      return mockStore.plans.map((p) => ({
        ...p,
        _count: { subscriptions: p.name === "Professional" ? 14 : p.name === "Starter" ? 8 : 4 },
      }));
    }

    return prisma.membershipPlan.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { subscriptions: true },
        },
      },
    });
  }

  async createPlan(data: any, adminId: string) {
    if (!process.env.DATABASE_URL) {
      const newPlan = {
        id: `plan-${Date.now()}`,
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
        description: data.description || "",
        price: Number(data.price),
        interval: data.interval || "monthly",
        generationLimit: Number(data.generationLimit),
        features: Array.isArray(data.features) ? data.features : [],
        isActive: data.isActive !== undefined ? data.isActive : true,
        sortOrder: Number(data.sortOrder) || 0,
      };
      mockStore.plans.push(newPlan);
      return newPlan;
    }

    const created = await prisma.membershipPlan.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
        description: data.description,
        price: Number(data.price),
        interval: data.interval || "monthly",
        generationLimit: Number(data.generationLimit),
        features: Array.isArray(data.features) ? data.features : [],
        isActive: data.isActive !== undefined ? data.isActive : true,
        sortOrder: Number(data.sortOrder) || 0,
      },
    });

    await auditService.log({
      adminId,
      action: "CREATE_PLAN",
      targetType: "MembershipPlan",
      targetId: created.id,
      details: created,
    });

    return created;
  }

  async updatePlan(id: string, data: any, adminId: string) {
    if (!process.env.DATABASE_URL) {
      const plan = mockStore.plans.find((p) => p.id === id);
      if (plan) {
        if (data.name) plan.name = data.name;
        if (data.description) plan.description = data.description;
        if (data.price !== undefined) plan.price = Number(data.price);
        if (data.generationLimit !== undefined) plan.generationLimit = Number(data.generationLimit);
      }
      return plan || {};
    }

    const updated = await prisma.membershipPlan.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price !== undefined ? Number(data.price) : undefined,
        generationLimit: data.generationLimit !== undefined ? Number(data.generationLimit) : undefined,
        features: data.features !== undefined ? data.features : undefined,
        isActive: data.isActive !== undefined ? data.isActive : undefined,
        sortOrder: data.sortOrder !== undefined ? Number(data.sortOrder) : undefined,
      },
    });

    await auditService.log({
      adminId,
      action: "UPDATE_PLAN",
      targetType: "MembershipPlan",
      targetId: id,
      details: updated,
    });

    return updated;
  }

  async deletePlan(id: string, adminId: string) {
    if (!process.env.DATABASE_URL) {
      const idx = mockStore.plans.findIndex((p) => p.id === id);
      if (idx !== -1) mockStore.plans.splice(idx, 1);
      return { id };
    }

    const deleted = await prisma.membershipPlan.delete({
      where: { id },
    });

    await auditService.log({
      adminId,
      action: "DELETE_PLAN",
      targetType: "MembershipPlan",
      targetId: id,
      details: { name: deleted.name },
    });

    return deleted;
  }

  // Payments & Verifications
  async getPayments(status?: string) {
    if (!process.env.DATABASE_URL) {
      return status
        ? mockStore.verifications.filter((v) => v.status === status)
        : mockStore.verifications;
    }

    const where: any = {};
    if (status) where.status = status;

    return prisma.paymentVerification.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getPendingVerifications() {
    if (!process.env.DATABASE_URL) {
      return mockStore.verifications.filter((v) => v.status === "pending");
    }

    return prisma.paymentVerification.findMany({
      where: { status: "pending" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAllSubscriptions() {
    if (!process.env.DATABASE_URL) {
      return mockStore.users
        .filter((u) => u.hasActivePlan)
        .map((u) => ({
          id: `sub-${u.id}`,
          status: "active",
          userId: u.id,
          user: { id: u.id, name: u.name, email: u.email },
          plan: { name: u.planName, price: u.planPrice },
          createdAt: u.createdAt,
        }));
    }

    return prisma.subscription.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        plan: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const adminService = new AdminService();
