-- EduLead Network — Storage RLS
-- Run AFTER policies/database-rls.sql (requires public.is_active_admin()).
-- Review bucket names against supabase/setup/buckets.md before applying.

-- ---------------------------------------------------------------------------
-- public-media
-- ---------------------------------------------------------------------------

CREATE POLICY "public_media_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'public-media');

CREATE POLICY "public_media_admin_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'public-media'
    AND public.is_active_admin()
  );

CREATE POLICY "public_media_admin_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'public-media'
    AND public.is_active_admin()
  )
  WITH CHECK (
    bucket_id = 'public-media'
    AND public.is_active_admin()
  );

CREATE POLICY "public_media_admin_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'public-media'
    AND public.is_active_admin()
  );

-- ---------------------------------------------------------------------------
-- private-submissions — no public read
-- ---------------------------------------------------------------------------

CREATE POLICY "private_submissions_admin_select"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'private-submissions'
    AND public.is_active_admin()
  );

CREATE POLICY "private_submissions_admin_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'private-submissions'
    AND public.is_active_admin()
  );

CREATE POLICY "private_submissions_admin_update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'private-submissions'
    AND public.is_active_admin()
  )
  WITH CHECK (
    bucket_id = 'private-submissions'
    AND public.is_active_admin()
  );

CREATE POLICY "private_submissions_admin_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'private-submissions'
    AND public.is_active_admin()
  );

-- TODO: Server-side uploads use the service role and bypass these policies.
-- TODO: Signed URL access for private objects is not implemented in the app yet.
