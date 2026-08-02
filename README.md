# EduLead Network

A production-quality web platform for **EduLead Network** — an emerging leadership-development organisation bridging the gap between education and leadership readiness.

## Overview

This platform includes:

- **Public website** — programmes, opportunities, events, insights, team, join forms, contact
- **Admin dashboard** — content management, submissions, media library, settings
- **Structured CMS** — editable page sections without breaking design
- **Forms & email** — Resend notifications, Cloudflare Turnstile spam protection
- **Media storage** — Supabase Storage for images and documents

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router), TypeScript (strict) |
| Public UI | Tailwind CSS, Framer Motion |
| Admin UI | Ant Design |
| Database | Supabase PostgreSQL + Prisma ORM |
| Auth | Supabase Auth (admin-only) |
| Storage | Supabase Storage |
| Forms | React Hook Form + Zod |
| Rich Text | Tiptap |
| Email | Resend |
| Analytics | Google Analytics |
| Deployment | Vercel |

## Prerequisites

- Node.js 20+
- npm
- Supabase project
- Resend account (optional for local dev)
- Cloudflare Turnstile keys (optional for local dev)

## Local Setup

```bash
# Clone and install
git clone <repo-url>
cd edulead
npm install

# Configure environment
cp .env.example .env.local
# Fill in all values (see Environment Variables below)

# Database
npm run db:push
npm run db:seed

# Development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for admin.

## Environment Variables

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
RESEND_API_KEY=
EMAIL_FROM=EduLead Network <noreply@yourdomain.com>
ADMIN_NOTIFICATION_EMAIL=admin@yourdomain.com
JOIN_SUBMISSION_NOTIFICATION_EMAIL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## Supabase Setup

### 1. Create Project

Create a new Supabase project at [supabase.com](https://supabase.com).

### 2. Database Connection

In Supabase → Settings → Database, copy:

- **Connection string (Transaction mode)** → `DATABASE_URL`
- **Connection string (Session mode)** → `DIRECT_URL`

### 3. Authentication

Enable Email provider in Authentication → Providers.

Create admin users manually:

```sql
-- After creating user in Supabase Auth dashboard, link to admin profile:
INSERT INTO "AdminProfile" ("id", "userId", "email", "fullName", "role", "active")
VALUES (gen_random_uuid()::text, '<supabase-user-id>', 'admin@yourdomain.com', 'Admin Name', 'ADMIN', true);
```

Or use the Supabase dashboard to create users, then run Prisma seed after adding the profile.

### 4. Storage Buckets

Create two buckets in Storage:

| Bucket | Public | Purpose |
|--------|--------|---------|
| `public-media` | Yes | Images, public PDFs |
| `private-submissions` | No | Partner proposals, attachments |

**Folder structure within buckets:**

```
branding/
team/
programmes/
events/
opportunities/
articles/
resources/
join-attachments/
general/
```

### 5. Row Level Security (RLS)

Enable RLS on all tables. For MVP admin-only access via service role:

```sql
-- Example: deny public access to admin tables
ALTER TABLE "AdminProfile" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public access" ON "AdminProfile" FOR ALL USING (false);

-- Public read for published content
ALTER TABLE "Programme" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published programmes" ON "Programme"
  FOR SELECT USING ("published" = true AND "deletedAt" IS NULL);
```

Apply similar policies for `Opportunity`, `Event`, `Article`, `TeamMember`, `PageContent`, and `SiteSetting`.

Form submissions (`JoinSubmission`, `ContactMessage`, `NewsletterSubscriber`) should deny public SELECT.

## Database Migrations

```bash
# Push schema to database
npm run db:push

# Or use migrations for production
npm run db:migrate

# Seed starter content
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Resend Setup

1. Create account at [resend.com](https://resend.com)
2. Verify your sending domain
3. Add `RESEND_API_KEY` and `EMAIL_FROM` to environment

## Turnstile Setup

1. Create widget at [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
2. Add site key and secret to environment
3. In development, Turnstile is bypassed when keys are not set

## Admin Creation

1. Create user in Supabase Auth (email + password)
2. Insert `AdminProfile` record linking `userId` to the Supabase user ID
3. Log in at `/admin/login`

There is no public registration page.

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run format       # Prettier
npm run typecheck    # TypeScript check
npm run test         # Run tests
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema
npm run db:seed      # Seed database
```

## Production Build

```bash
npm run build
npm run start
```

## Vercel Deployment

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

### Domain Setup

1. Add custom domain in Vercel
2. Update `NEXT_PUBLIC_SITE_URL` to production URL
3. Configure DNS records as instructed by Vercel
4. Add domain to Resend for email delivery

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public website routes
│   ├── admin/             # Admin dashboard
│   └── api/               # API route handlers
├── components/
│   ├── public/            # Public UI components
│   └── admin/             # Admin UI components
├── hooks/
├── lib/
│   ├── actions/           # Server actions
│   ├── data/              # Data fetching
│   ├── email/             # Email templates
│   ├── supabase/          # Supabase clients
│   └── validations/       # Zod schemas
└── test/
prisma/
├── schema.prisma
└── seed.ts
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection fails | Check `DATABASE_URL` and `DIRECT_URL`; ensure Supabase project is active |
| Admin login redirects loop | Verify `AdminProfile` exists and `active = true` |
| Emails not sending | Check `RESEND_API_KEY`; emails are optional in dev |
| Upload fails | Verify Supabase storage buckets exist and service role key is set |
| Build fails on Prisma | Run `npm run db:generate` before build |

## Content Guidelines

- Present EduLead as an **emerging organisation**
- Do not publish unverified personal information
- Mark placeholder content as "Requires client confirmation" in admin
- Never present planned targets as completed impact

## License

Proprietary — EduLead Network. All rights reserved.
