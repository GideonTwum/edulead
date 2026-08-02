-- EduLead Network — Database RLS
-- Review prisma/schema.prisma before applying.
-- Prisma/service-role database connections may bypass RLS.

-- ---------------------------------------------------------------------------
-- Helper: active admin check via AdminProfile
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM "AdminProfile"
    WHERE "userId" = auth.uid()::text
      AND active = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_active_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_active_admin() TO authenticated;

-- ---------------------------------------------------------------------------
-- Enable RLS on all application tables
-- ---------------------------------------------------------------------------
ALTER TABLE "AdminProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteSetting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PageContent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Programme" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProgrammeInterest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Opportunity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EventRegistration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Article" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ArticleCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeamMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JoinSubmission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NewsletterSubscriber" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MediaAsset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- AdminProfile — admin-only
-- ---------------------------------------------------------------------------
CREATE POLICY "admin_profile_admin_select"
  ON "AdminProfile"
  FOR SELECT
  TO authenticated
  USING (public.is_active_admin());

CREATE POLICY "admin_profile_admin_update"
  ON "AdminProfile"
  FOR UPDATE
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- TODO: AdminProfile rows are created manually outside the app API.
-- No INSERT/DELETE policies are defined for authenticated clients.

-- ---------------------------------------------------------------------------
-- SiteSetting — public read, admin write
-- ---------------------------------------------------------------------------
CREATE POLICY "site_setting_public_read"
  ON "SiteSetting"
  FOR SELECT
  USING (true);

CREATE POLICY "site_setting_admin_insert"
  ON "SiteSetting"
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_active_admin());

CREATE POLICY "site_setting_admin_update"
  ON "SiteSetting"
  FOR UPDATE
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

CREATE POLICY "site_setting_admin_delete"
  ON "SiteSetting"
  FOR DELETE
  TO authenticated
  USING (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- PageContent — public read for published visible sections
-- ---------------------------------------------------------------------------
CREATE POLICY "page_content_public_read"
  ON "PageContent"
  FOR SELECT
  USING (published = true AND visible = true);

CREATE POLICY "page_content_admin_all"
  ON "PageContent"
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- Programme — public read for published, non-deleted records
-- ---------------------------------------------------------------------------
CREATE POLICY "programme_public_read"
  ON "Programme"
  FOR SELECT
  USING (published = true AND "deletedAt" IS NULL);

CREATE POLICY "programme_admin_all"
  ON "Programme"
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- ProgrammeInterest — private submissions, admin-only
-- ---------------------------------------------------------------------------
CREATE POLICY "programme_interest_admin_all"
  ON "ProgrammeInterest"
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- Opportunity — public read for published, non-deleted records
-- ---------------------------------------------------------------------------
CREATE POLICY "opportunity_public_read"
  ON "Opportunity"
  FOR SELECT
  USING (published = true AND "deletedAt" IS NULL);

CREATE POLICY "opportunity_admin_all"
  ON "Opportunity"
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- Event — public read for published, non-deleted records
-- ---------------------------------------------------------------------------
CREATE POLICY "event_public_read"
  ON "Event"
  FOR SELECT
  USING (published = true AND "deletedAt" IS NULL);

CREATE POLICY "event_admin_all"
  ON "Event"
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- EventRegistration — private submissions, admin-only
-- ---------------------------------------------------------------------------
CREATE POLICY "event_registration_admin_all"
  ON "EventRegistration"
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- Article — public read for published, non-deleted records
-- ---------------------------------------------------------------------------
CREATE POLICY "article_public_read"
  ON "Article"
  FOR SELECT
  USING (status = 'PUBLISHED' AND "deletedAt" IS NULL);

CREATE POLICY "article_admin_all"
  ON "Article"
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- ArticleCategory — public read
-- ---------------------------------------------------------------------------
CREATE POLICY "article_category_public_read"
  ON "ArticleCategory"
  FOR SELECT
  USING (true);

CREATE POLICY "article_category_admin_all"
  ON "ArticleCategory"
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- TeamMember — public read for active members
-- ---------------------------------------------------------------------------
CREATE POLICY "team_member_public_read"
  ON "TeamMember"
  FOR SELECT
  USING (active = true);

CREATE POLICY "team_member_admin_all"
  ON "TeamMember"
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- JoinSubmission — private submissions, admin-only
-- ---------------------------------------------------------------------------
CREATE POLICY "join_submission_admin_all"
  ON "JoinSubmission"
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- ContactMessage — private submissions, admin-only
-- ---------------------------------------------------------------------------
CREATE POLICY "contact_message_admin_all"
  ON "ContactMessage"
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- NewsletterSubscriber — private records, admin-only
-- ---------------------------------------------------------------------------
CREATE POLICY "newsletter_subscriber_admin_all"
  ON "NewsletterSubscriber"
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- MediaAsset — admin-only (metadata; files live in storage.objects)
-- ---------------------------------------------------------------------------
CREATE POLICY "media_asset_admin_all"
  ON "MediaAsset"
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- ---------------------------------------------------------------------------
-- AuditLog — admin read-only via authenticated client
-- ---------------------------------------------------------------------------
CREATE POLICY "audit_log_admin_select"
  ON "AuditLog"
  FOR SELECT
  TO authenticated
  USING (public.is_active_admin());

-- TODO: Audit logs are written server-side. No client INSERT policy is defined.
