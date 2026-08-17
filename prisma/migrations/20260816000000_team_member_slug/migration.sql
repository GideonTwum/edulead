-- TeamMember: add slug (required for /team/[slug] profiles) and make role optional.

ALTER TABLE "TeamMember" ADD COLUMN IF NOT EXISTS "slug" TEXT;

UPDATE "TeamMember"
SET "slug" = trim(both '-' from regexp_replace(lower("fullName"), '[^a-z0-9]+', '-', 'g'))
WHERE "slug" IS NULL OR "slug" = '';

ALTER TABLE "TeamMember" ALTER COLUMN "role" DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "TeamMember_slug_key" ON "TeamMember"("slug");

ALTER TABLE "TeamMember" ALTER COLUMN "slug" SET NOT NULL;
