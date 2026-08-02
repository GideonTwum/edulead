# Supabase Storage Buckets

Create these buckets in **Supabase Dashboard → Storage** after deploying the Prisma schema.

## `public-media`

| Setting | Value |
|---------|-------|
| Public bucket | **Yes** |
| Max file size | **10 MB** |
| Allowed MIME types | `image/jpeg`, `image/png`, `image/webp`, `application/pdf` |

### Approved folders

Used by the application upload whitelist in `src/lib/constants.ts`:

- `branding`
- `team`
- `programmes`
- `events`
- `opportunities`
- `articles`
- `resources`
- `general`

Public objects receive public URLs. Admin uploads are server-side via `/api/upload` using the service role.

## `private-submissions`

| Setting | Value |
|---------|-------|
| Public bucket | **No** |
| Max file size | **10 MB** |
| Allowed MIME types | `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |

### Approved folders

- `partner-proposals`
- `join-attachments`

### Notes

- Private objects must **not** receive public URLs.
- **Signed URLs are not yet implemented** in the application for private downloads.
- The `JoinSubmission.attachmentUrl` field exists in the schema but the public join flow does not upload files yet.

## Policy files

After creating buckets, apply policies in this order:

1. `../policies/database-rls.sql`
2. `../policies/storage-rls.sql`

See `../README.md` and `../../docs/supabase-setup.md` for setup steps and warnings. Do not use deprecated `auth.role()` examples from older documentation.
