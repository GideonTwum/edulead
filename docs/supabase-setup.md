# Supabase Storage & RLS Setup

Run these steps after creating your Supabase project.

## Storage Buckets

In Supabase Dashboard → Storage → New bucket:

### public-media
- **Public bucket:** Yes
- **Allowed MIME types:** image/jpeg, image/png, image/webp, application/pdf
- **Max file size:** 10MB

### private-submissions
- **Public bucket:** No
- **Allowed MIME types:** application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
- **Max file size:** 10MB

## Storage Policies

### public-media (public read, authenticated write)

```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-media');

CREATE POLICY "Admin upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'public-media'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Admin delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'public-media'
  AND auth.role() = 'authenticated'
);
```

### private-submissions (authenticated only)

```sql
CREATE POLICY "Admin only access"
ON storage.objects FOR ALL
USING (
  bucket_id = 'private-submissions'
  AND auth.role() = 'authenticated'
);
```

## Database RLS Policies

Run in Supabase SQL Editor after `prisma db push`:

```sql
-- Admin tables: no public access
ALTER TABLE "AdminProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JoinSubmission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NewsletterSubscriber" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProgrammeInterest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EventRegistration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MediaAsset" ENABLE ROW LEVEL SECURITY;

-- Public read for published content
ALTER TABLE "Programme" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_programmes" ON "Programme"
  FOR SELECT USING ("published" = true AND "deletedAt" IS NULL);

ALTER TABLE "Opportunity" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_opportunities" ON "Opportunity"
  FOR SELECT USING ("published" = true AND "deletedAt" IS NULL);

ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_events" ON "Event"
  FOR SELECT USING ("published" = true AND "deletedAt" IS NULL);

ALTER TABLE "Article" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_articles" ON "Article"
  FOR SELECT USING ("status" = 'PUBLISHED' AND "deletedAt" IS NULL);

ALTER TABLE "TeamMember" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_team" ON "TeamMember"
  FOR SELECT USING ("active" = true);

ALTER TABLE "PageContent" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_pages" ON "PageContent"
  FOR SELECT USING ("published" = true AND "visible" = true);

ALTER TABLE "SiteSetting" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_settings" ON "SiteSetting"
  FOR SELECT USING (true);

ALTER TABLE "ArticleCategory" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_categories" ON "ArticleCategory"
  FOR SELECT USING (true);
```

> **Note:** The Next.js app uses the Supabase service role key server-side for admin operations and Prisma for database access. RLS provides an additional security layer if direct Supabase client access is used.

## Google Search Console

1. Deploy site to production
2. Add property in [Google Search Console](https://search.google.com/search-console)
3. Verify via DNS or HTML tag
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`
