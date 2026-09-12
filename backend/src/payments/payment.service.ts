import { prisma } from "../config/prisma.js";
import { config } from "../config/index.js";
import { supabaseAdmin, SUPABASE_BUCKETS } from "../config/supabase.config.js";
import { mockStore } from "../mock/mockStore.js";
import { emailService } from "../email/email.service.js";
import { AppError, ValidationError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";

export class PaymentService {
  async getUpiDetails(planId: string) {
    if (!process.env.DATABASE_URL) {
      const plan = mockStore.plans.find((p) => p.id === planId) || mockStore.plans[0];
      const upiId = config.upi.id;
      const recipientName = "JEWELAI";
      const amount = plan.price;
      const note = `JEWELAI ${plan.name} Membership`;

      const upiIntentUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
        recipientName
      )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

      return {
        plan: {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          generationLimit: plan.generationLimit,
          interval: plan.interval,
        },
        upiId,
        recipientName,
        amount,
        currency: "INR",
        upiIntentUri,
        qrCodeUrl: config.upi.qrCodeUrl,
        instructions: [
          "1. Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, CRED, etc.)",
          `2. Transfer exact amount: ₹${amount}`,
          "3. Copy the 12-digit UTR / Bank Reference Number",
          "4. Take a clear screenshot showing the successful transaction",
          "5. Submit the UTR number and screenshot below for verification",
        ],
      };
    }

    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      throw new AppError("NOT_FOUND", "Selected membership plan is not available.", 404);
    }

    const upiId = config.upi.id;
    const recipientName = "JEWELAI";
    const amount = plan.price;
    const note = `JEWELAI ${plan.name} Membership`;

    const upiIntentUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
      recipientName
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    return {
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        generationLimit: plan.generationLimit,
        interval: plan.interval,
      },
      upiId,
      recipientName,
      amount,
      currency: "INR",
      upiIntentUri,
      qrCodeUrl: config.upi.qrCodeUrl,
      instructions: [
        "1. Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, CRED, etc.)",
        `2. Transfer exact amount: ₹${amount}`,
        "3. Copy the 12-digit UTR / Bank Reference Number",
        "4. Take a clear screenshot showing the successful transaction",
        "5. Submit the UTR number and screenshot below for verification",
      ],
    };
  }

  async submitVerification(params: {
    userId: string;
    planId: string;
    utrNumber: string;
    amount: number;
    screenshotFile?: Express.Multer.File;
  }) {
    const { userId, planId, utrNumber, amount, screenshotFile } = params;

    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      throw new ValidationError("A valid 12-digit UTR / Transaction Reference number is required.");
    }

    if (!screenshotFile) {
      throw new ValidationError("Please upload a screenshot of your successful UPI transaction.");
    }

    const plan = !process.env.DATABASE_URL
      ? (mockStore.plans.find((p) => p.id === planId) || mockStore.plans[0])
      : await prisma.membershipPlan.findUnique({
          where: { id: planId },
        });

    if (!plan) {
      throw new AppError("NOT_FOUND", "Selected membership plan not found.", 404);
    }

    if (!process.env.DATABASE_URL) {
      const existing = mockStore.verifications.find((v) => v.utrNumber === cleanUtr);
      if (existing) {
        throw new ValidationError(
          "This UTR / Transaction Reference number has already been submitted.",
          "DUPLICATE_UTR"
        );
      }
    } else {
      // Check duplicate UTR
      const existing = await prisma.paymentVerification.findUnique({
        where: { utrNumber: cleanUtr },
      });

      if (existing) {
        throw new ValidationError(
          "This UTR / Transaction Reference number has already been submitted.",
          "DUPLICATE_UTR"
        );
      }
    }

    // 1. Upload screenshot to Supabase Storage (or local storage fallback)
    let screenshotUrl = "";
    const fileExt = path.extname(screenshotFile.originalname) || ".png";
    const storageKey = `${userId}/${Date.now()}-${uuidv4()}${fileExt}`;

    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin.storage
          .from(SUPABASE_BUCKETS.PAYMENTS)
          .upload(storageKey, screenshotFile.buffer, {
            contentType: screenshotFile.mimetype,
            upsert: true,
          });

        if (error) {
          logger.warn({ error }, "Supabase storage upload failed; creating signed or public URL");
        }

        // Try getting signed URL or public URL
        const { data: signedData } = await supabaseAdmin.storage
          .from(SUPABASE_BUCKETS.PAYMENTS)
          .createSignedUrl(storageKey, 60 * 60 * 24 * 365); // 1 year validity for verification review

        screenshotUrl = signedData?.signedUrl || `${config.storage.supabase.url}/storage/v1/object/public/${SUPABASE_BUCKETS.PAYMENTS}/${storageKey}`;
      } catch (err) {
        logger.error({ err }, "Error uploading payment screenshot to Supabase Storage");
      }
    }

    // Local fallback if Supabase Storage is not reachable
    if (!screenshotUrl) {
      const uploadDir = path.resolve(process.cwd(), "uploads", "payments");
      await fs.mkdir(uploadDir, { recursive: true });
      const localFilePath = path.join(uploadDir, `${Date.now()}-${uuidv4()}${fileExt}`);
      await fs.writeFile(localFilePath, screenshotFile.buffer);
      screenshotUrl = `/uploads/payments/${path.basename(localFilePath)}`;
    }

    if (!process.env.DATABASE_URL) {
      const mockVerification: any = {
        id: `pv-${Date.now()}`,
        userId,
        planId: plan.id,
        utrNumber: cleanUtr,
        amount: Number(amount) || plan.price,
        upiId: config.upi.id,
        screenshotUrl,
        status: "pending",
        reviewedBy: null,
        reviewedAt: null,
        adminNotes: null,
        createdAt: new Date(),
        user: { id: userId, email: "user@jewelai.com", name: "Customer" },
        plan,
      };
      mockStore.verifications.unshift(mockVerification);

      const user = mockStore.users.find((u) => u.id === userId);
      if (user) {
        user.status = "pending_verification";
        user.planName = plan.name;
        user.planPrice = plan.price;
      }

      return mockVerification;
    }

    // 2. Create PaymentVerification in DB
    const verification = await prisma.paymentVerification.create({
      data: {
        userId,
        planId,
        utrNumber: cleanUtr,
        amount: Number(amount) || plan.price,
        screenshotUrl,
        status: "pending",
      },
      include: { plan: true, user: true },
    });

    // 3. Upsert Subscription to pending_verification
    const existingSub = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (existingSub) {
      await prisma.subscription.update({
        where: { id: existingSub.id },
        data: {
          planId,
          status: "pending_verification",
        },
      });
    } else {
      await prisma.subscription.create({
        data: {
          userId,
          planId,
          status: "pending_verification",
        },
      });
    }

    // 4. Create User Notification
    await prisma.notification.create({
      data: {
        userId,
        title: "Payment Submitted",
        message: `Your payment verification for ${plan.name} (UTR: ${cleanUtr}) has been submitted and is pending admin approval.`,
        type: "payment",
      },
    });

    // 5. Send confirmation email
    if (verification.user?.email) {
      emailService.sendPaymentSubmitted(
        verification.user.email,
        plan.name,
        cleanUtr,
        verification.amount
      ).catch((e) => logger.warn({ e }, "Failed to dispatch payment submitted email"));
    }

    return verification;
  }

  async getMyVerifications(userId: string) {
    if (!process.env.DATABASE_URL) {
      return mockStore.verifications.filter((v) => v.userId === userId);
    }
    const list = await prisma.paymentVerification.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });
    return list;
  }
}

export const paymentService = new PaymentService();
