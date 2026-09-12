import { Request, Response, NextFunction } from "express";
import { membershipService } from "./membership.service.js";

export class MembershipController {
  async getPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plans = await membershipService.getPublicPlans();
      res.status(200).json({ success: true, data: plans });
    } catch (error) {
      next(error);
    }
  }

  async getMyMembership(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const data = await membershipService.getUserMembership(req.user.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async cancelMembership(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const result = await membershipService.cancelSubscription(req.user.id);
      res.status(200).json({
        success: true,
        data: result,
        message: "Your subscription will remain active until the end of the billing period.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const membershipController = new MembershipController();
