import { Router } from "express";
import { adminController } from "./admin.controller.js";
import { requireAuth } from "../auth/middleware/auth.middleware.js";
import { requireAdmin } from "./middleware/admin.middleware.js";

const router = Router();

// All admin routes require authentication and ADMIN role
router.use(requireAuth);
router.use(requireAdmin);

// Dashboard stats
router.get("/dashboard", (req, res, next) => adminController.getDashboard(req, res, next));

// Users management
router.get("/users", (req, res, next) => adminController.getUsers(req, res, next));
router.get("/users/:id", (req, res, next) => adminController.getUserDetail(req, res, next));
router.patch("/users/:id", (req, res, next) => adminController.updateUser(req, res, next));
router.delete("/users/:id", (req, res, next) => adminController.deleteUser(req, res, next));
router.get("/users/:id/usage", (req, res, next) => adminController.getUserUsage(req, res, next));
router.post("/users/:id/grant-membership", (req, res, next) =>
  adminController.grantMembership(req, res, next)
);
router.post("/users/:id/revoke-membership", (req, res, next) =>
  adminController.revokeMembership(req, res, next)
);

// Plans management
router.get("/plans", (req, res, next) => adminController.getPlans(req, res, next));
router.post("/plans", (req, res, next) => adminController.createPlan(req, res, next));
router.patch("/plans/:id", (req, res, next) => adminController.updatePlan(req, res, next));
router.delete("/plans/:id", (req, res, next) => adminController.deletePlan(req, res, next));

// Payments & Verification review
router.get("/payments", (req, res, next) => adminController.getPayments(req, res, next));
router.get("/payments/verifications", (req, res, next) =>
  adminController.getVerifications(req, res, next)
);
router.post("/payments/verifications/:id/approve", (req, res, next) =>
  adminController.approveVerification(req, res, next)
);
router.post("/payments/verifications/:id/reject", (req, res, next) =>
  adminController.rejectVerification(req, res, next)
);

// Subscriptions & Audit logs
router.get("/subscriptions", (req, res, next) => adminController.getSubscriptions(req, res, next));
router.get("/audit-logs", (req, res, next) => adminController.getAuditLogs(req, res, next));

export const adminRoutes = router;
