import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("4000").transform((val) => parseInt(val, 10)),
  CLIENT_URL: z.string().default("http://localhost:3000"),
  USER_FRONTEND_URL: z.string().default("http://localhost:3000"),
  ADMIN_FRONTEND_URL: z.string().default("http://localhost:3001"),

  // Supabase
  SUPABASE_URL: z.string().optional().default(""),
  SUPABASE_KEY: z.string().optional().default(""),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(""),
  SUPABASE_ANON_KEY: z.string().optional().default(""),
  SUPABASE_JWT_SECRET: z.string().optional().default(""),

  // Storage Buckets
  SUPABASE_UPLOADS_BUCKET: z.string().default("jewelai-uploads"),
  SUPABASE_GENERATED_BUCKET: z.string().default("jewelai-generated"),
  SUPABASE_PAYMENTS_BUCKET: z.string().default("jewelai-payments"),
  SUPABASE_PUBLIC_BUCKET: z.string().default("jewelai-public"),
  STORAGE_PROVIDER: z.enum(["local", "supabase", "s3"]).default("supabase"),

  // Database
  DATABASE_URL: z.string().optional().default(""),

  // Gemini AI Image Configuration
  GEMINI_API_KEY: z.string().optional().default(""),
  GEMINI_IMAGE_MODEL: z.string().default("gemini-2.5-flash-image"),

  // UPI Configuration
  UPI_ID: z.string().default("jewelai@upi"),
  UPI_QR_CODE_URL: z
    .string()
    .default("https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.jpg"),

  // Email Configuration
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.string().default("587").transform((val) => parseInt(val, 10)),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  SMTP_FROM: z.string().default("JEWELAI <noreply@jewelai.com>"),

  // JWT
  JWT_SECRET: z.string().default("jewelai-secret-jwt-key-2026-secure-token"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // Rate Limiting
  GENERAL_RATE_LIMIT_WINDOW_MS: z.string().default("900000").transform((v) => parseInt(v, 10)),
  GENERAL_RATE_LIMIT_MAX: z.string().default("100").transform((v) => parseInt(v, 10)),
  AI_RATE_LIMIT_WINDOW_MS: z.string().default("600000").transform((v) => parseInt(v, 10)),
  AI_RATE_LIMIT_MAX: z.string().default("20").transform((v) => parseInt(v, 10)),

  // Upload limits
  MAX_UPLOAD_MB: z.string().default("8").transform((v) => parseInt(v, 10)),
  MAX_FILE_SIZE: z.string().default("8388608").transform((v) => parseInt(v, 10)),
  MAX_PAYMENT_SCREENSHOT_SIZE: z.string().default("5242880").transform((v) => parseInt(v, 10)),
});

const parsed = envSchema.safeParse(process.env);

export const env = parsed.success ? parsed.data : envSchema.parse({});

export const config = {
  env: env.NODE_ENV,
  isProduction: env.NODE_ENV === "production",
  port: env.PORT,
  clientUrl: env.CLIENT_URL,
  userFrontendUrl: env.USER_FRONTEND_URL,
  adminFrontendUrl: env.ADMIN_FRONTEND_URL,
  gemini: {
    apiKey: process.env.GEMINI_KEY || process.env.GEMINI_API_KEY || "",
    imageModel: env.GEMINI_IMAGE_MODEL,
  },
  storage: {
    provider: env.STORAGE_PROVIDER,
    supabase: {
      url: env.SUPABASE_URL,
      serviceKey: env.SUPABASE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || "",
      bucket: env.SUPABASE_GENERATED_BUCKET,
    },
    s3: {
      region: process.env.AWS_REGION || "eu-north-1",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      bucketName: process.env.AWS_BUCKET_NAME || "ai-jewelry-bucket",
    },
  },
  upi: {
    id: env.UPI_ID,
    qrCodeUrl: env.UPI_QR_CODE_URL,
  },
  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.SMTP_FROM,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  rateLimits: {
    generalWindowMs: env.GENERAL_RATE_LIMIT_WINDOW_MS,
    generalMax: env.GENERAL_RATE_LIMIT_MAX,
    aiWindowMs: env.AI_RATE_LIMIT_WINDOW_MS,
    aiMax: env.AI_RATE_LIMIT_MAX,
    general: {
      windowMs: env.GENERAL_RATE_LIMIT_WINDOW_MS,
      max: env.GENERAL_RATE_LIMIT_MAX,
    },
    ai: {
      windowMs: env.AI_RATE_LIMIT_WINDOW_MS,
      max: env.AI_RATE_LIMIT_MAX,
    },
  },
  maxUploadMb: env.MAX_UPLOAD_MB,
  maxUploadBytes: env.MAX_UPLOAD_MB * 1024 * 1024,
  maxPaymentScreenshotBytes: env.MAX_PAYMENT_SCREENSHOT_SIZE,
};

export default env;
