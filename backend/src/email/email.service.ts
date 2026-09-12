import nodemailer, { type Transporter } from "nodemailer";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";

class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    if (config.email.user && config.email.pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host: config.email.host,
          port: config.email.port,
          secure: config.email.port === 465,
          auth: {
            user: config.email.user,
            pass: config.email.pass,
          },
        });
      } catch (err) {
        logger.error({ err }, "Failed to initialize nodemailer transport");
      }
    } else {
      logger.info("SMTP credentials not provided. EmailService will log emails to console (mock mode).");
    }
  }

  async sendMail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      if (!this.transporter) {
        logger.info({ to, subject }, "[MOCK EMAIL SENT] HTML length: " + html.length);
        return true;
      }

      await this.transporter.sendMail({
        from: config.email.from,
        to,
        subject,
        html,
      });

      logger.info({ to, subject }, "Email sent successfully");
      return true;
    } catch (error) {
      logger.error({ error, to, subject }, "Failed to send email");
      return false;
    }
  }

  async sendPaymentSubmitted(userEmail: string, planName: string, utr: string, amount: number) {
    const subject = `JEWELAI — Payment Verification Received (${planName})`;
    const html = `
      <div style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 32px; border-radius: 8px;">
        <h2 style="color: #fbbf24; margin-bottom: 8px;">JEWELAI Luxury Virtual Try-On</h2>
        <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
        <p style="font-size: 15px; line-height: 1.6;">We have successfully received your UPI payment verification submission for the <strong>${planName}</strong> plan (₹${amount}).</p>
        <div style="background: #1e293b; padding: 16px; border-radius: 6px; margin: 20px 0; border: 1px solid #334155;">
          <p style="margin: 4px 0;"><strong>UTR / Transaction Reference:</strong> <code style="color: #38bdf8;">${utr}</code></p>
          <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #fbbf24;">Pending Verification</span></p>
          <p style="margin: 4px 0;"><strong>Estimated Approval:</strong> Within 15 - 30 minutes</p>
        </div>
        <p style="font-size: 14px; color: #94a3b8;">Our admin team is currently reviewing your payment screenshot. You will receive an immediate notification once your AI generation credits are activated.</p>
        <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b;">© 2026 JEWELAI Inc. All rights reserved.</p>
      </div>
    `;
    return this.sendMail(userEmail, subject, html);
  }

  async sendPaymentApproved(userEmail: string, planName: string, generations: number) {
    const subject = `💎 Welcome to JEWELAI ${planName} — Membership Activated!`;
    const html = `
      <div style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 32px; border-radius: 8px;">
        <h2 style="color: #fbbf24; margin-bottom: 8px;">JEWELAI Virtual Studio</h2>
        <p style="font-size: 16px; line-height: 1.6;">Congratulations!</p>
        <p style="font-size: 15px; line-height: 1.6;">Your UPI payment has been verified and your <strong>${planName}</strong> membership is now <strong style="color: #10b981;">ACTIVE</strong>.</p>
        <div style="background: #1e293b; padding: 16px; border-radius: 6px; margin: 20px 0; border: 1px solid #334155;">
          <p style="margin: 4px 0;"><strong>Active Plan:</strong> ${planName}</p>
          <p style="margin: 4px 0;"><strong>Available Credits:</strong> <span style="color: #10b981; font-weight: bold;">${generations} AI Try-Ons</span></p>
          <p style="margin: 4px 0;"><strong>Studio Access:</strong> All 11 categories & regional attires unlocked</p>
        </div>
        <p><a href="${config.userFrontendUrl}/studio" style="display: inline-block; background: #fbbf24; color: #0f172a; padding: 12px 24px; font-weight: bold; border-radius: 6px; text-decoration: none;">Launch AI Jewelry Studio →</a></p>
        <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b;">© 2026 JEWELAI Inc. All rights reserved.</p>
      </div>
    `;
    return this.sendMail(userEmail, subject, html);
  }

  async sendPaymentRejected(userEmail: string, planName: string, reason?: string) {
    const subject = `JEWELAI — Payment Verification Notice (${planName})`;
    const html = `
      <div style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 32px; border-radius: 8px;">
        <h2 style="color: #f43f5e; margin-bottom: 8px;">JEWELAI Verification Update</h2>
        <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
        <p style="font-size: 15px; line-height: 1.6;">We were unable to verify your payment for the <strong>${planName}</strong> plan.</p>
        <div style="background: #1e293b; padding: 16px; border-radius: 6px; margin: 20px 0; border: 1px solid #334155;">
          <p style="margin: 4px 0;"><strong>Reason:</strong> ${reason || "The UTR number or payment screenshot could not be matched with bank statements."}</p>
        </div>
        <p style="font-size: 14px; color: #94a3b8;">Please re-submit your valid transaction receipt or contact our support team if you believe this is an error.</p>
        <p><a href="${config.userFrontendUrl}/payments" style="display: inline-block; background: #38bdf8; color: #0f172a; padding: 10px 20px; font-weight: bold; border-radius: 6px; text-decoration: none;">Re-submit Payment Details</a></p>
      </div>
    `;
    return this.sendMail(userEmail, subject, html);
  }
}

export const emailService = new EmailService();
