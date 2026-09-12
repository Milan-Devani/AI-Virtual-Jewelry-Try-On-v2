import { prisma } from "../config/prisma.js";
import { mockStore } from "../mock/mockStore.js";

export class AuditService {
  async log(params: {
    adminId: string;
    action: string;
    targetType: string;
    targetId: string;
    details?: any;
    ipAddress?: string;
  }) {
    if (!process.env.DATABASE_URL) {
      mockStore.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        action: params.action,
        entityType: params.targetType,
        entityId: params.targetId,
        details: params.details || {},
        createdAt: new Date(),
        admin: { name: "System Administrator", email: "admin@jewelai.com" },
      });
      return null;
    }

    try {
      return await prisma.auditLog.create({
        data: {
          adminId: params.adminId,
          action: params.action,
          targetType: params.targetType,
          targetId: params.targetId,
          details: params.details || {},
          ipAddress: params.ipAddress,
        },
      });
    } catch (err) {
      console.error("Failed to write audit log:", err);
      return null;
    }
  }

  async getLogs(limit = 100, page = 1) {
    if (!process.env.DATABASE_URL) {
      const logs = mockStore.auditLogs;
      return { logs, total: logs.length, page: 1, totalPages: 1 };
    }

    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          admin: {
            select: { id: true, email: true, name: true },
          },
        },
      }),
      prisma.auditLog.count(),
    ]);

    return { logs, total, page, totalPages: Math.ceil(total / limit) };
  }
}

export const auditService = new AuditService();
