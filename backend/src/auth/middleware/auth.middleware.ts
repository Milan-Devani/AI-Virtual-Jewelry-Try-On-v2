import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config/index.js";
import { prisma } from "../../config/prisma.js";
import { supabaseAdmin } from "../../config/supabase.config.js";
import { AuthenticationError } from "../../utils/errors.js";
import { logger } from "../../utils/logger.js";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("Authorization header missing or invalid format. Expected Bearer token.");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AuthenticationError("Token missing from authorization header.");
    }

    let userId: string | null = null;
    let email: string | null = null;
    let userRole: "USER" | "ADMIN" = "USER";
    let userName: string | null = null;

    // 1. First try Supabase Auth token verification if Supabase client is available
    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin.auth.getUser(token);
        if (!error && data?.user) {
          userId = data.user.id;
          email = data.user.email || "";
          userRole = (data.user.user_metadata?.role as "USER" | "ADMIN") || "USER";
          userName = data.user.user_metadata?.name || null;
        }
      } catch {
        // Fallback to local JWT verification
      }
    }

    // 2. Fallback to application JWT verification
    if (!userId) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as {
          id: string;
          email: string;
          role?: "USER" | "ADMIN";
          name?: string;
        };
        userId = decoded.id;
        email = decoded.email;
        if (decoded.role) userRole = decoded.role;
        if (decoded.name) userName = decoded.name;
      } catch (jwtErr) {
        throw new AuthenticationError("Session token expired or invalid.");
      }
    }

    if (!userId) {
      throw new AuthenticationError("Invalid authentication credentials.");
    }

    // 3. Sync or fetch from Prisma database if available
    try {
      if (process.env.DATABASE_URL) {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (dbUser) {
          userRole = dbUser.role as "USER" | "ADMIN";
          email = dbUser.email;
          userName = dbUser.name;
        } else if (email) {
          // If user exists in Supabase Auth but not yet in Prisma, auto-sync
          const created = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              id: userId,
              email,
              name: userName,
              role: userRole,
            },
          });
          userRole = created.role as "USER" | "ADMIN";
        }
      }
    } catch (dbErr) {
      logger.warn({ dbErr }, "Database user lookup failed; continuing with token payload.");
    }

    req.user = {
      id: userId,
      email: email || "",
      role: userRole,
      name: userName,
    };

    next();
  } catch (error) {
    next(error);
  }
}
