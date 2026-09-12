import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "../utils/logger.js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

export const SUPABASE_BUCKETS = {
  UPLOADS: process.env.SUPABASE_UPLOADS_BUCKET || "jewelai-uploads",
  GENERATED: process.env.SUPABASE_GENERATED_BUCKET || "jewelai-generated",
  PAYMENTS: process.env.SUPABASE_PAYMENTS_BUCKET || "jewelai-payments",
  PUBLIC: process.env.SUPABASE_PUBLIC_BUCKET || "jewelai-public",
};

export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export const supabasePublic: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

if (!supabaseAdmin) {
  logger.warn("SUPABASE_URL or SUPABASE_KEY not fully configured. Some Supabase features will run in mock/local fallback mode.");
}
