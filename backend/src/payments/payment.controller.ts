import { Request, Response, NextFunction } from "express";
import { paymentService } from "./payment.service.js";

export class PaymentController {
  async getUpiDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { planId } = req.params;
      const data = await paymentService.getUpiDetails(planId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async submitVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const { planId, utrNumber, amount } = req.body;
      const file = req.file;

      const result = await paymentService.submitVerification({
        userId: req.user.id,
        planId,
        utrNumber,
        amount: Number(amount),
        screenshotFile: file,
      });

      res.status(201).json({
        success: true,
        data: result,
        message: "Payment verification submitted successfully. It will be reviewed by admin shortly.",
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyVerifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }
      const data = await paymentService.getMyVerifications(req.user.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();
