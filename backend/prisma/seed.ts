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

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      name: "JEWELAI Administrator",
      passwordHash,
      role: Role.ADMIN,
      forcePasswordChange: true,
    },
  });

  console.log(`✅ Seeded Admin: ${adminUser.email} (Role: ${adminUser.role})`);
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
