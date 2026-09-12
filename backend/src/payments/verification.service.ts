import { prisma } from "../config/prisma.js";
import { emailService } from "../email/email.service.js";
import { mockStore } from "../mock/mockStore.js";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export class VerificationService {
  async approveVerification(verificationId: string, adminId: string, adminNotes?: string) {
    if (!process.env.DATABASE_URL) {
      const v = mockStore.verifications.find((item) => item.id === verificationId);
      if (!v) {
        throw new AppError("NOT_FOUND", "Verification record not found.", 404);
      }
      v.status = "approved";
      v.reviewedBy = adminId;
      v.reviewedAt = new Date();
      v.adminNotes = adminNotes || "Payment verified and approved by admin.";

      const user = mockStore.users.find((u) => u.id === v.userId);
      if (user) {
        user.hasActivePlan = true;
        user.activePlanLabel = "TRUE";
        user.planName = v.plan.name;
        user.planPrice = v.plan.price;
        user.generationLimit = v.plan.generationLimit;
        user.status = "active";
      }

      return {
        verification: v,
        subscription: {
          id: `sub-${v.id}`,
          status: "active",
          userId: v.userId,
          plan: v.plan,
        },
      };
    }

    const verification = await prisma.paymentVerification.findUnique({
      where: { id: verificationId },
      include: { user: true, plan: true },
    });

    if (!verification) {
      throw new AppError("NOT_FOUND", "Verification record not found.", 404);
    }

    if (verification.status === "approved") {
      throw new AppError("ALREADY_APPROVED", "This payment verification has already been approved.", 400);
    }

    // 1. Update verification record
    const updatedVerification = await prisma.paymentVerification.update({
      where: { id: verificationId },
      data: {
        status: "approved",
        reviewedBy: adminId,
        reviewedAt: new Date(),
        adminNotes: adminNotes || "Payment verified and approved by admin.",
      },
      include: { user: true, plan: true },
    });

    // 2. Calculate subscription period (1 month from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // 3. Update or create active subscription
    const existingSub = await prisma.subscription.findFirst({
      where: { userId: verification.userId },
      orderBy: { createdAt: "desc" },
    });

    let subscription;
    if (existingSub) {
      subscription = await prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          planId: verification.planId,
          status: "active",
          currentPeriodStart: startDate,
          currentPeriodEnd: endDate,
          cancelAtPeriodEnd: false,
        },
      });
    } else {
      subscription = await prisma.subscription.create({
        data: {
          userId: verification.userId,
          planId: verification.planId,
          status: "active",
          currentPeriodStart: startDate,
          currentPeriodEnd: endDate,
        },
      });
    }

    // 4. Create Notification for User
    await prisma.notification.create({
      data: {
        userId: verification.userId,
        title: "💎 Membership Activated!",
        message: `Your payment for ${verification.plan.name} has been verified. You now have ${verification.plan.generationLimit} AI virtual try-on credits!`,
        type: "success",
      },
    });

    // 5. Create Audit Log
    await prisma.auditLog.create({
      data: {
        adminId,
        action: "APPROVE_PAYMENT",
        targetType: "PaymentVerification",
        targetId: verification.id,
        details: {
          userId: verification.userId,
          planId: verification.planId,
          planName: verification.plan.name,
          utrNumber: verification.utrNumber,
          amount: verification.amount,
        },
      },
    });

    // 6. Send confirmation email
    if (verification.user?.email) {
      emailService
        .sendPaymentApproved(
          verification.user.email,
          verification.plan.name,
          verification.plan.generationLimit
        )
        .catch((e) => logger.warn({ e }, "Failed to send payment approved email"));
    }

    return { verification: updatedVerification, subscription };
  }

  async rejectVerification(verificationId: string, adminId: string, reason?: string) {
    if (!process.env.DATABASE_URL) {
      const v = mockStore.verifications.find((item) => item.id === verificationId);
      if (!v) {
        throw new AppError("NOT_FOUND", "Verification record not found.", 404);
      }
      v.status = "rejected";
      v.reviewedBy = adminId;
      v.reviewedAt = new Date();
      v.adminNotes = reason || "Payment verification rejected.";

      const user = mockStore.users.find((u) => u.id === v.userId);
      if (user && !user.hasActivePlan) {
        user.status = "rejected";
      }

      return v;
    }

    const verification = await prisma.paymentVerification.findUnique({
      where: { id: verificationId },
      include: { user: true, plan: true },
    });

    if (!verification) {
      throw new AppError("NOT_FOUND", "Verification record not found.", 404);
    }

    // 1. Update verification record
    const updatedVerification = await prisma.paymentVerification.update({
      where: { id: verificationId },
      data: {
        status: "rejected",
        reviewedBy: adminId,
        reviewedAt: new Date(),
        adminNotes: reason || "Payment verification rejected.",
      },
      include: { user: true, plan: true },
    });

    // 2. Set subscription status to rejected (or inactive if previous was not active)
    const existingSub = await prisma.subscription.findFirst({
      where: { userId: verification.userId },
      orderBy: { createdAt: "desc" },
    });

    if (existingSub && existingSub.status === "pending_verification") {
      await prisma.subscription.update({
        where: { id: existingSub.id },
        data: { status: "rejected" },
      });
    }

    // 3. Create Notification for User
    await prisma.notification.create({
      data: {
        userId: verification.userId,
        title: "Payment Verification Notice",
        message: `Your payment verification for ${verification.plan.name} was rejected. Reason: ${
          reason || "Transaction details could not be verified."
        }`,
        type: "warning",
      },
    });

    // 4. Create Audit Log
    await prisma.auditLog.create({
      data: {
        adminId,
        action: "REJECT_PAYMENT",
        targetType: "PaymentVerification",
        targetId: verification.id,
        details: {
          userId: verification.userId,
          planId: verification.planId,
          utrNumber: verification.utrNumber,
          reason,
        },
      },
    });

    // 5. Send notification email
    if (verification.user?.email) {
      emailService
        .sendPaymentRejected(verification.user.email, verification.plan.name, reason)
        .catch((e) => logger.warn({ e }, "Failed to send payment rejected email"));
    }

    return updatedVerification;
  }
}

export const verificationService = new VerificationService();
