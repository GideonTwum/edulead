# Supabase Setup Guide

Operational setup steps for EduLead Network on Supabase. This guide covers project creation, environment configuration, schema deployment, buckets, admin access, and **where to apply policies**.

> **Important:** Do not copy policy SQL from older documentation versions.  
> The authoritative and current RLS policy files are located in:
>
> - `supabase/policies/database-rls.sql`
> - `supabase/policies/storage-rls.sql`
>
> Supporting references:
>
> - `supabase/README.md` — architecture, apply order, warnings
> - `supabase/setup/buckets.md` — bucket limits, MIME types, folders

## Before you begin

- Review `prisma/schema.prisma` before applying any SQL in Supabase.
- **Do not execute production SQL blindly.** Confirm policy names and table columns match the current schema.
- Keep `SUPABASE_SERVICE_ROLE_KEY` **server-only** (`.env.local`, Vercel secrets). Never expose it to the browser or commit it to Git.
- The app reads/writes primarily through **Prisma** (`DATABASE_URL`). The service role and Postgres superuser connections typically **bypass RLS**. Policies are **defense in depth** for direct Supabase client access.

## 1. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Note the project URL and API keys for local environment setup.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and set:

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key (**server-only**) |
| `DATABASE_URL` | Supabase → Settings → Database → Connection string (Transaction / pooler) |
| `DIRECT_URL` | Supabase → Settings → Database → Connection string (Session / direct) |

Do not commit `.env` or `.env.local`.

## 3. Deploy the database schema

From the project root:

```bash
npm run db:push
```

Optional starter content:

```bash
npm run db:seed
```

There is currently no committed `prisma/migrations/` history. Use `db push` for local/staging unless your team adopts a baseline migration workflow for production.

## 4. Create the admin Auth user

1. Supabase Dashboard → **Authentication → Providers** → enable **Email**.
2. Supabase Dashboard → **Authentication → Users** → create a user (email + password).

## 5. Add the matching AdminProfile

After the Auth user exists, link it to an admin profile in the database.

```sql
INSERT INTO "AdminProfile" ("id", "userId", "email", "fullName", "role", "active")
VALUES (
  gen_random_uuid()::text,
  '<supabase-user-id>',
  'admin@yourdomain.com',
  'Admin Name',
  'ADMIN',
  true
);
```

Replace `<supabase-user-id>` with the UUID from Supabase Auth. Only users with an **active** `AdminProfile` row can access `/admin` (see `supabase/policies/database-rls.sql` for the `is_active_admin()` helper used in RLS).

## 6. Create storage buckets

Create buckets in **Supabase Dashboard → Storage**. Full details are in `supabase/setup/buckets.md`.

| Bucket | Public | Max size | Allowed MIME types |
|--------|--------|----------|-------------------|
| `public-media` | **Yes** | 10 MB | `image/jpeg`, `image/png`, `image/webp`, `application/pdf` |
| `private-submissions` | **No** | 10 MB | `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |

### Approved folders

**`public-media`:** `branding`, `team`, `programmes`, `events`, `opportunities`, `articles`, `resources`, `general`

**`private-submissions`:** `partner-proposals`, `join-attachments`

Public bucket objects may receive public URLs. Private bucket objects must not. Signed private downloads are **not yet implemented** in the application.

## 7. Apply RLS policies (authoritative SQL files)

Apply in this order in the **Supabase SQL Editor**:

1. **`supabase/policies/database-rls.sql`**
   - Creates `public.is_active_admin()` (`auth.uid()` + active `AdminProfile`)
   - Enables RLS on all application tables
   - Public read policies for published/active content
   - Admin policies for private submissions and CMS tables

2. **`supabase/policies/storage-rls.sql`**
   - Requires step 1 (`is_active_admin()` must exist)
   - `public-media`: public read; active-admin insert/update/delete
   - `private-submissions`: no public read; active-admin select/insert/update/delete

If policies already exist in a project, review diffs carefully before re-running `CREATE POLICY` statements.

### Deprecated documentation

Older examples that used `auth.role() = 'authenticated'` or broad authenticated-user access are **removed**. They allowed any logged-in Supabase user, not just active admins. Use only the files under `supabase/policies/`.

## 8. Verify locally

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Confirm admin login, media upload, and form submissions against your configured project.

## Google Search Console (production)

1. Deploy the site to production.
2. Add the property in [Google Search Console](https://search.google.com/search-console).
3. Verify via DNS or HTML tag.
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

## Further reading

- `supabase/README.md` — policy architecture and service-role bypass notes
- `README.md` — full local setup, Git, and deployment prerequisites
