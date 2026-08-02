# Supabase Infrastructure

Version-controlled Supabase setup for EduLead Network. These files document buckets, storage policies, and database RLS for **defense in depth**. They do not replace application-level authorization.

## Important architecture notes

- The Next.js app reads and writes data primarily through **Prisma** using `DATABASE_URL`.
- Admin uploads and server operations may use the **Supabase service role** server-side.
- Connections using the Postgres service role or superuser typically **bypass RLS**.
- Policies here protect against direct access through the Supabase **anon** or **authenticated** client APIs.
- **Do not execute production SQL blindly.** Review `prisma/schema.prisma` compatibility first.

## Files

| File | Purpose |
|------|---------|
| `setup/buckets.md` | Bucket names, limits, MIME types, and approved folders |
| `policies/database-rls.sql` | Database RLS enablement, helper function, table policies |
| `policies/storage-rls.sql` | Storage bucket policies for `public-media` and `private-submissions` |

## Application order

Apply to a **new Supabase project** in this order:

1. Create the Supabase project and configure environment variables locally.
2. Run `npm run db:push` (or your approved migration workflow) so tables match `prisma/schema.prisma`.
3. Create storage buckets as described in `setup/buckets.md`.
4. Run `policies/database-rls.sql` in the Supabase SQL Editor.
5. Run `policies/storage-rls.sql` in the Supabase SQL Editor.

## Manual application status

These SQL files are prepared from the current project documentation and schema review.

- **Applied manually in production:** Unknown — confirm in your Supabase dashboard before re-running.
- If policies already exist, review diffs carefully instead of blindly re-executing `CREATE POLICY` statements.

## Admin verification model

Policies use `public.is_active_admin()`, which checks:

- `auth.uid()` matches `"AdminProfile"."userId"`
- `"AdminProfile"."active" = true`

This avoids broad `auth.role() = 'authenticated'` access for any logged-in Supabase user.

## Service-role bypass implications

Server-side Prisma and service-role storage operations may bypass these policies depending on the database/storage role used. RLS still matters for:

- Future direct Supabase client usage
- Accidental exposure of the anon key
- Defense in depth if client-side access expands later

## Credentials

Never commit `.env`, `.env.local`, or real Supabase keys. Use `.env.example` for variable names only.
