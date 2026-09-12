import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { prisma } from "../config/prisma.js";
import { supabaseAdmin } from "../config/supabase.config.js";
import { mockStore, MockUser } from "../mock/mockStore.js";
import { AuthenticationError, ValidationError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export class AuthService {
  async register(data: { email: string; password: string; name?: string }) {
    const email = data.email.toLowerCase().trim();
    if (!email || !data.password || data.password.length < 6) {
      throw new ValidationError("Valid email and password (minimum 6 characters) are required.");
    }

    // Offline / Mock development fallback when DATABASE_URL is not set
    if (!process.env.DATABASE_URL) {
      const existing = mockStore.users.find((u) => u.email === email);
      if (existing) {
        throw new ValidationError("An account with this email already exists.");
      }
      const newUser: MockUser = {
        id: `usr-${Date.now()}`,
        email,
        name: data.name || email.split("@")[0],
        role: "USER",
        createdAt: new Date(),
        hasActivePlan: false,
        activePlanLabel: "FALSE",
        planName: "None",
        planPrice: 0,
        generationLimit: 0,
        totalGenerations: 0,
        status: "no_plan",
      };
      mockStore.users.push(newUser);
      const token = this.generateToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      });
      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
        token,
      };
    }

    // 1. Create in Supabase Auth if configured
    let supabaseUserId: string | null = null;
    if (supabaseAdmin) {
      try {
        const { data: sbData, error: sbError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: data.password,
          email_confirm: true,
          user_metadata: { name: data.name || "", role: "USER" },
        });
        if (!sbError && sbData.user) {
          supabaseUserId = sbData.user.id;
        } else if (sbError && !sbError.message.includes("already registered")) {
          logger.warn({ sbError }, "Supabase createUser returned warning");
        }
      } catch (err) {
        logger.warn({ err }, "Supabase Auth signup skipped; falling back to local database");
      }
    }

    // 2. Check if user already exists in DB
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ValidationError("An account with this email already exists.");
    }

    // 3. Hash password and create in Prisma DB
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        id: supabaseUserId || undefined,
        email,
        name: data.name || email.split("@")[0],
        passwordHash,
        role: "USER",
      },
    });

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  async login(data: { email: string; password: string }) {
    const email = data.email.toLowerCase().trim();
    if (!email || !data.password) {
      throw new ValidationError("Email and password are required.");
    }

    // Offline / Mock development fallback when DATABASE_URL is not set
    if (!process.env.DATABASE_URL) {
      if (email === "admin@jewelai.com") {
        if (data.password !== "Admin@2026") {
          throw new AuthenticationError("Invalid email or password.");
        }
        const adminUser = mockStore.users.find((u) => u.email === "admin@jewelai.com")!;
        const token = this.generateToken({
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
          name: adminUser.name,
        });
        return {
          user: {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role,
            forcePasswordChange: false,
            activeSubscription: {
              id: "sub-admin",
              status: "active",
              plan: {
                id: "plan-business",
                name: "Administrator VIP",
                price: 0,
                generationLimit: 99999,
              },
            },
          },
          token,
        };
      }

      // Check mock users or auto-create test user
      let mockUser = mockStore.users.find((u) => u.email === email);
      if (!mockUser) {
        mockUser = {
          id: `usr-${Date.now()}`,
          email,
          name: email.split("@")[0],
          role: "USER",
          createdAt: new Date(),
          hasActivePlan: false,
          activePlanLabel: "FALSE",
          planName: "None",
          planPrice: 0,
          generationLimit: 0,
          totalGenerations: 0,
          status: "no_plan",
        };
        mockStore.users.push(mockUser);
      }

      const token = this.generateToken({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        name: mockUser.name,
      });

      return {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          forcePasswordChange: false,
          activeSubscription: mockUser.hasActivePlan
            ? {
                id: "sub-mock",
                status: "active",
                plan: {
                  id: "plan-active",
                  name: mockUser.planName,
                  price: mockUser.planPrice,
                  generationLimit: mockUser.generationLimit,
                },
              }
            : null,
        },
        token,
      };
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        subscriptions: {
          where: { status: "active" },
          include: { plan: true },
          take: 1,
        },
      },
    });

    if (!user || !user.passwordHash) {
      throw new AuthenticationError("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new AuthenticationError("Invalid email or password.");
    }

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const activeSub = user.subscriptions[0] || null;

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        forcePasswordChange: user.forcePasswordChange,
        activeSubscription: activeSub,
      },
      token,
    };
  }

  async getMe(userId: string) {
    // Offline / Mock development fallback when DATABASE_URL is not set
    if (!process.env.DATABASE_URL) {
      const mockUser = mockStore.users.find((u) => u.id === userId) || {
        id: userId,
        email: "user@jewelai.com",
        name: "Demo User",
        role: (userId === "admin-default-id" || userId.includes("admin") ? "ADMIN" : "USER") as "ADMIN" | "USER",
        createdAt: new Date(),
        hasActivePlan: userId === "admin-default-id" || userId.includes("admin"),
        planName: userId === "admin-default-id" || userId.includes("admin") ? "Administrator VIP" : "None",
        generationLimit: userId === "admin-default-id" || userId.includes("admin") ? 99999 : 0,
      };

      const isAdmin = mockUser.role === "ADMIN";
      const isSubActive = isAdmin || mockUser.hasActivePlan;

      return {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          createdAt: mockUser.createdAt,
        },
        subscription: isSubActive
          ? {
              id: "sub-mock",
              status: "active",
              plan: {
                id: "plan-active",
                name: mockUser.planName,
                price: 1999,
                generationLimit: mockUser.generationLimit,
              },
            }
          : null,
        membership: {
          status: isSubActive ? "active" : "inactive",
          plan: isSubActive
            ? {
                id: "plan-active",
                name: mockUser.planName,
                generationLimit: mockUser.generationLimit,
              }
            : null,
          totalCredits: mockUser.generationLimit || 0,
          usedCredits: 0,
          remainingCredits: mockUser.generationLimit || 0,
          isActive: isSubActive,
        },
        recentPayments: [],
        notifications: [],
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { plan: true },
        },
        paymentVerifications: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { plan: true },
        },
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!user) {
      throw new AuthenticationError("User not found.");
    }

    const currentSub = user.subscriptions[0] || null;
    let remainingCredits = 0;
    let totalCredits = 0;
    let usedCredits = 0;

    if (currentSub && currentSub.status === "active" && currentSub.plan) {
      totalCredits = currentSub.plan.generationLimit;
      const periodStart = currentSub.currentPeriodStart || new Date(0);

      const usageCount = await prisma.generationUsage.aggregate({
        where: {
          userId,
          status: "success",
          createdAt: { gte: periodStart },
        },
        _sum: { creditsUsed: true },
      });

      usedCredits = usageCount._sum.creditsUsed || 0;
      remainingCredits = Math.max(0, totalCredits - usedCredits);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
      subscription: currentSub,
      membership: {
        status: currentSub?.status || "inactive",
        plan: currentSub?.plan || null,
        totalCredits,
        usedCredits,
        remainingCredits,
        isActive: currentSub?.status === "active" && (!currentSub.currentPeriodEnd || new Date(currentSub.currentPeriodEnd) > new Date()),
      },
      recentPayments: user.paymentVerifications,
      notifications: user.notifications,
    };
  }

  generateToken(payload: { id: string; email: string; role: string; name?: string | null }) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });
  }
}

export const authService = new AuthService();
