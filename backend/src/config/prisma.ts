import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.js";

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

export const prisma =
  globalThis.__prismaClient ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prismaClient = prisma;
}

export async function connectPrisma(): Promise<void> {
  try {
    if (!process.env.DATABASE_URL) {
      logger.warn("DATABASE_URL is not set. Prisma database connection skipped.");
      return;
    }
    await prisma.$connect();
    logger.info("Connected successfully to PostgreSQL database via Prisma");
  } catch (error) {
    logger.error({ error }, "Failed to connect to database via Prisma");
  }
}
