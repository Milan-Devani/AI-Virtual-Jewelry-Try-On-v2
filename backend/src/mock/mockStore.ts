export interface MockUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: "ADMIN" | "USER";
  createdAt: Date;
  hasActivePlan: boolean;
  activePlanLabel: string;
  planName: string;
  planPrice: number;
  generationLimit: number;
  totalGenerations: number;
  status: string;
}

export interface MockVerification {
  id: string;
  userId: string;
  planId: string;
  utrNumber: string;
  amount: number;
  upiId: string;
  screenshotUrl: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy: string | null;
  reviewedAt: Date | null;
  adminNotes: string | null;
  createdAt: Date;
  user: { id: string; email: string; name: string };
  plan: { id: string; name: string; slug: string; price: number; generationLimit: number };
}

export interface MockPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  interval: string;
  generationLimit: number;
  isActive: boolean;
  features: string[];
  sortOrder: number;
}

class MockDataStore {
  public plans: MockPlan[] = [
    {
      id: "plan-starter",
      name: "Starter",
      slug: "starter",
      description: "Ideal for boutique jewelers and emerging designers starting with AI try-on.",
      price: 999,
      interval: "monthly",
      generationLimit: 50,
      isActive: true,
      sortOrder: 1,
      features: [
        "50 AI Virtual Try-Ons / month",
        "7 Core Jewelry Categories",
        "Custom Model & AI Persona Mode",
        "Standard HD Export",
        "Email Support",
      ],
    },
    {
      id: "plan-professional",
      name: "Professional",
      slug: "professional",
      description: "Perfect for established luxury retailers, multi-category catalogs, and e-commerce teams.",
      price: 1999,
      interval: "monthly",
      generationLimit: 150,
      isActive: true,
      sortOrder: 2,
      features: [
        "150 AI Virtual Try-Ons / month",
        "All 11 Jewelry Categories (including Sets & Bridal)",
        "11 Regional Indian Attire Presets",
        "4 Editorial Studio Backgrounds",
        "2K Ultra-HD Crisp Export",
        "Priority Generation Queue",
        "Dedicated Chat & Email Support",
      ],
    },
    {
      id: "plan-business",
      name: "Business",
      slug: "business",
      description: "For high-volume jewelry brands, multi-brand marketplaces, and enterprise studios.",
      price: 4999,
      interval: "monthly",
      generationLimit: 500,
      isActive: true,
      sortOrder: 3,
      features: [
        "500 AI Virtual Try-Ons / month",
        "Unlimited Model Personas & Custom Styling",
        "All 11 Categories + Custom Anatomical Anchoring",
        "Full Commercial Usage License",
        "4K Studio Master Export",
        "Dedicated Account Manager & VIP SLA",
      ],
    },
  ];

  public users: MockUser[] = [
    {
      id: "usr-demo-1",
      email: "ananya.sharma@tanishq-partner.com",
      name: "Ananya Sharma",
      firstName: "Ananya",
      lastName: "Sharma",
      phoneNumber: "+91 98765 43210",
      role: "USER",
      createdAt: new Date(Date.now() - 86400000 * 5),
      hasActivePlan: true,
      activePlanLabel: "TRUE",
      planName: "Professional",
      planPrice: 1999,
      generationLimit: 150,
      totalGenerations: 42,
      status: "active",
    },
    {
      id: "usr-demo-2",
      email: "rahul.mehta@heritagejewels.in",
      name: "Rahul Mehta",
      firstName: "Rahul",
      lastName: "Mehta",
      phoneNumber: "+91 98234 56789",
      role: "USER",
      createdAt: new Date(Date.now() - 86400000 * 3),
      hasActivePlan: false,
      activePlanLabel: "FALSE",
      planName: "Starter",
      planPrice: 999,
      generationLimit: 50,
      totalGenerations: 0,
      status: "pending_verification",
    },
    {
      id: "usr-demo-3",
      email: "priya.nair@kalyanjewellers-demo.com",
      name: "Priya Nair",
      firstName: "Priya",
      lastName: "Nair",
      phoneNumber: "+91 97123 45678",
      role: "USER",
      createdAt: new Date(Date.now() - 86400000 * 12),
      hasActivePlan: true,
      activePlanLabel: "TRUE",
      planName: "Business",
      planPrice: 4999,
      generationLimit: 500,
      totalGenerations: 188,
      status: "active",
    },
    {
      id: "usr-demo-4",
      email: "vikram.patel@zoya-studio.com",
      name: "Vikram Patel",
      firstName: "Vikram",
      lastName: "Patel",
      phoneNumber: "+91 99012 34567",
      role: "USER",
      createdAt: new Date(Date.now() - 86400000 * 20),
      hasActivePlan: false,
      activePlanLabel: "FALSE",
      planName: "None",
      planPrice: 0,
      generationLimit: 0,
      totalGenerations: 2,
      status: "no_plan",
    },
    {
      id: "admin-default-id",
      email: "admin@jewelai.com",
      name: "System Administrator",
      firstName: "System",
      lastName: "Administrator",
      phoneNumber: "+91 98000 00000",
      role: "ADMIN",
      createdAt: new Date(Date.now() - 86400000 * 30),
      hasActivePlan: true,
      activePlanLabel: "TRUE",
      planName: "Administrator VIP",
      planPrice: 0,
      generationLimit: 99999,
      totalGenerations: 12,
      status: "active",
    },
  ];

  public verifications: MockVerification[] = [
    {
      id: "pv-demo-001",
      userId: "usr-demo-2",
      planId: "plan-starter",
      utrNumber: "426189324012",
      amount: 999,
      upiId: "rahul@okaxis",
      screenshotUrl: "https://images.unsplash.com/photo-1554415707-9e4466b0f530?w=600&q=80",
      status: "pending",
      reviewedBy: null,
      reviewedAt: null,
      adminNotes: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      user: {
        id: "usr-demo-2",
        email: "rahul.mehta@heritagejewels.in",
        name: "Rahul Mehta",
      },
      plan: {
        id: "plan-starter",
        name: "Starter",
        slug: "starter",
        price: 999,
        generationLimit: 50,
      },
    },
    {
      id: "pv-demo-002",
      userId: "usr-demo-1",
      planId: "plan-professional",
      utrNumber: "426019842109",
      amount: 1999,
      upiId: "ananya@okhdfcbank",
      screenshotUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=80",
      status: "approved",
      reviewedBy: "admin-default-id",
      reviewedAt: new Date(Date.now() - 86400000 * 5),
      adminNotes: "UTR confirmed via ICICI UPI merchant statement.",
      createdAt: new Date(Date.now() - 86400000 * 5),
      user: {
        id: "usr-demo-1",
        email: "ananya.sharma@tanishq-partner.com",
        name: "Ananya Sharma",
      },
      plan: {
        id: "plan-professional",
        name: "Professional",
        slug: "professional",
        price: 1999,
        generationLimit: 150,
      },
    },
  ];

  public auditLogs = [
    {
      id: "audit-001",
      action: "ADMIN_LOGIN",
      entityType: "Admin",
      entityId: "admin-default-id",
      details: { email: "admin@jewelai.com", ip: "::1" },
      createdAt: new Date(Date.now() - 1000 * 60 * 10),
      admin: { name: "System Administrator", email: "admin@jewelai.com" },
    },
    {
      id: "audit-002",
      action: "VERIFICATION_APPROVED",
      entityType: "PaymentVerification",
      entityId: "pv-demo-002",
      details: { utr: "426019842109", amount: 1999, user: "ananya.sharma@tanishq-partner.com" },
      createdAt: new Date(Date.now() - 86400000 * 5),
      admin: { name: "System Administrator", email: "admin@jewelai.com" },
    },
  ];
}

export const mockStore = new MockDataStore();
