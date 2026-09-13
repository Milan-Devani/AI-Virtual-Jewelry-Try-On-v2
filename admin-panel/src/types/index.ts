export interface AdminUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email: string;
  role: "USER" | "ADMIN";
  status: "active" | "pending_verification" | "expired" | "rejected" | "no_plan";
  planName: string;
  planPrice: number;
  hasActivePlan: boolean; // CRITICAL: Boolean active plan status
  activePlanLabel: "TRUE" | "FALSE";
  generationLimit: number;
  totalGenerations: number;
  createdAt: string;
}

export interface PaymentVerification {
  id: string;
  userId: string;
  planId: string;
  utrNumber: string;
  amount: number;
  screenshotUrl: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name?: string | null;
    email: string;
  };
  plan?: {
    id: string;
    name: string;
    price: number;
    generationLimit: number;
  };
}

export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  interval: string;
  generationLimit: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
  _count?: {
    subscriptions: number;
  };
}

export interface DashboardStats {
  overview: {
    totalUsers: number;
    activeSubscriptions: number;
    pendingVerifications: number;
    totalTryOns: number;
    totalRevenueINR: number;
  };
  recentVerifications: PaymentVerification[];
  recentTryOns: any[];
  categoryBreakdown: { category: string; count: number }[];
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: any;
  ipAddress?: string | null;
  createdAt: string;
  admin?: {
    id: string;
    email: string;
    name?: string | null;
  };
}
