-- ==============================================================================
-- JEWELAI — SUPABASE DATABASE & STORAGE INITIALIZATION SCRIPT
-- Run this in the Supabase SQL Editor to configure Buckets, RLS, and Policies
-- ==============================================================================

-- 1. CREATE STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('jewelai-uploads', 'jewelai-uploads', false, 8388608, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('jewelai-generated', 'jewelai-generated', true, 16777216, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('jewelai-payments', 'jewelai-payments', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('jewelai-public', 'jewelai-public', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. STORAGE RLS POLICIES

-- jewelai-public: Everyone can read
CREATE POLICY "Public read for jewelai-public"
ON storage.objects FOR SELECT
USING (bucket_id = 'jewelai-public');

-- jewelai-public: Authenticated users / service role can insert
CREATE POLICY "Public write for authenticated users"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'jewelai-public' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));

-- jewelai-uploads: Users can manage their own uploads (folder prefix = auth.uid())
CREATE POLICY "Users upload own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'jewelai-uploads' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR auth.role() = 'service_role')
);

CREATE POLICY "Users view own uploads"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'jewelai-uploads' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR auth.role() = 'service_role')
);

-- jewelai-payments: Users can upload screenshots (service role can read for admin review)
CREATE POLICY "Users upload payment screenshots"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'jewelai-payments' AND 
  (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

CREATE POLICY "Users read own payment screenshots and admin reads all"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'jewelai-payments' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR auth.role() = 'service_role')
);

-- jewelai-generated: Public or Authenticated read
CREATE POLICY "Read generated images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'jewelai-generated'
);

CREATE POLICY "Insert generated images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'jewelai-generated' AND 
  (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS) FOR CORE TABLES (If applying directly)
-- Note: When Backend connects using service_role / DATABASE_URL, it bypasses RLS safely.
-- If user-frontend accesses Supabase client directly, these policies enforce auth boundaries.

ALTER TABLE IF EXISTS "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "MembershipPlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "PaymentVerification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "GenerationUsage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "AuditLog" ENABLE ROW LEVEL SECURITY;

-- Allow public read on active membership plans
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view active plans'
  ) THEN
    CREATE POLICY "Anyone can view active plans" ON "MembershipPlan"
      FOR SELECT USING ("isActive" = true);
  END IF;
END $$;
