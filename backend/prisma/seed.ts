import dotenv from "dotenv";
dotenv.config({ override: true });

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting JEWELAI Database Seed...");

  // 1. Seed Default Membership Plans
  const plans = [
    {
      id: "plan-starter",
      name: "Starter",
      slug: "starter",
      description: "Ideal for boutique jewelers and emerging designers starting with AI try-on.",
      price: 999,
      interval: "monthly",
      generationLimit: 50,
      sortOrder: 1,
      isActive: true,
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
      sortOrder: 2,
      isActive: true,
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
      sortOrder: 3,
      isActive: true,
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

  for (const p of plans) {
    await prisma.membershipPlan.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        generationLimit: p.generationLimit,
        features: p.features,
        isActive: p.isActive,
        sortOrder: p.sortOrder,
      },
      create: p,
    });
    console.log(`✅ Seeded plan: ${p.name} (₹${p.price})`);
  }

  // 2. Seed Default Admin User
  const adminEmail = "admin@jewelai.com";
  const defaultPassword = "Admin@2026";
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(defaultPassword, salt);

  const adminUser = await (prisma as any).admin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      name: "JEWELAI Administrator",
      firstName: "System",
      lastName: "Administrator",
      phoneNumber: "+91 98000 00000",
      passwordHash,
      role: Role.ADMIN,
      forcePasswordChange: true,
    },
  });

  console.log(`✅ Seeded Admin: ${adminUser.email} (Role: ${adminUser.role}) into Admin table`);

  // 3. Seed Demo User with Active Subscription
  const demoEmail = "ananya.sharma@tanishq-partner.com";
  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      id: "usr-demo-1",
      email: demoEmail,
      name: "Ananya Sharma",
      firstName: "Ananya",
      lastName: "Sharma",
      phoneNumber: "+91 98765 43210",
      passwordHash,
      role: Role.USER,
    },
  });

  const professionalPlan = await prisma.membershipPlan.findUnique({
    where: { slug: "professional" },
  });

  if (professionalPlan) {
    const existingSub = await prisma.subscription.findFirst({
      where: { userId: demoUser.id },
    });
    if (!existingSub) {
      await prisma.subscription.create({
        data: {
          userId: demoUser.id,
          planId: professionalPlan.id,
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      console.log(`✅ Seeded active subscription for ${demoUser.email}`);
    }
  }

  console.log("🚀 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
