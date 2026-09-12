import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/errors.js";

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    return next(new AppError("AUTH_REQUIRED", "Authentication required.", 401));
  }

  if (req.user.role !== "ADMIN") {
    return next(
      new AppError(
        "FORBIDDEN",
        "Access denied. Administrator privileges are required to access this resource.",
        403
      )
    );
  }

  next();
}
