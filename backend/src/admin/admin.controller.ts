import { Request, Response, NextFunction } from "express";
import { adminService } from "./admin.service.js";
import { verificationService } from "../payments/verification.service.js";
import { auditService } from "./audit.service.js";

export class AdminController {
  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getDashboardStats();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, filter, page, limit } = req.query;
      const data = await adminService.getUsers({
        search: search as string,
        filter: filter as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getUserDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = await adminService.getUserDetail(id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getUserUsage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = await adminService.getUserUsage(id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = req.user!.id;
      const { firstName, lastName, name, email, phoneNumber, planId } = req.body;
      const updatedUser = await adminService.updateUser(
        id,
        { firstName, lastName, name, email, phoneNumber, planId },
        adminId
      );
      res.status(200).json({ success: true, data: updatedUser, message: "User updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = req.user!.id;
      const result = await adminService.deleteUser(id, adminId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async grantMembership(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { planId, durationDays } = req.body;
      const adminId = req.user!.id;
      const result = await adminService.grantMembership({
        userId: id,
        planId,
        durationDays: durationDays ? Number(durationDays) : 30,
        adminId,
      });
      res.status(200).json({ success: true, data: result, message: "Membership granted successfully" });
    } catch (error) {
      next(error);
    }
  }

  async revokeMembership(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = req.user!.id;
      const result = await adminService.revokeMembership(id, adminId, reason);
      res.status(200).json({ success: true, data: result, message: "Membership revoked successfully" });
    } catch (error) {
      next(error);
    }
  }

  // Plans
  async getPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getPlans();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user!.id;
      const data = await adminService.createPlan(req.body, adminId);
      res.status(201).json({ success: true, data, message: "Plan created successfully" });
    } catch (error) {
      next(error);
    }
  }

  async updatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = req.user!.id;
      const data = await adminService.updatePlan(id, req.body, adminId);
      res.status(200).json({ success: true, data, message: "Plan updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  async deletePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = req.user!.id;
      const data = await adminService.deletePlan(id, adminId);
      res.status(200).json({ success: true, data, message: "Plan deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  // Payments & Verifications
  async getPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.query;
      const data = await adminService.getPayments(status as string);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getVerifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getPendingVerifications();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async approveVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const adminId = req.user!.id;
      const result = await verificationService.approveVerification(id, adminId, notes);
      res.status(200).json({ success: true, data: result, message: "Payment verified and membership activated!" });
    } catch (error) {
      next(error);
    }
  }

  async rejectVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = req.user!.id;
      const result = await verificationService.rejectVerification(id, adminId, reason);
      res.status(200).json({ success: true, data: result, message: "Payment verification rejected." });
    } catch (error) {
      next(error);
    }
  }

  async getSubscriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await adminService.getAllSubscriptions();
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit, page } = req.query;
      const data = await auditService.getLogs(
        limit ? parseInt(limit as string, 10) : 100,
        page ? parseInt(page as string, 10) : 1
      );
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
