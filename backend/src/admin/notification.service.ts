import { prisma } from "../config/prisma.js";

export class NotificationService {
  async notify(userId: string, title: string, message: string, type: string = "info", metadata?: any) {
    if (!process.env.DATABASE_URL) {
      return null;
    }
    try {
      return await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          metadata: metadata || {},
        },
      });
    } catch (err) {
      console.error("Failed to create in-app notification:", err);
      return null;
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    if (!process.env.DATABASE_URL) {
      return { count: 0 };
    }
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    if (!process.env.DATABASE_URL) {
      return { count: 0 };
    }
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}

export const notificationService = new NotificationService();
