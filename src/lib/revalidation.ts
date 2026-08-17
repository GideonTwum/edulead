import { revalidatePath } from "next/cache";
import { PageKey } from "@prisma/client";
import { ROUTES } from "@/lib/constants";

/**
 * Centralized public cache invalidation for CMS mutations.
 *
 * Uses explicit `revalidatePath()` rather than `unstable_cache` / `revalidateTag` because
 * the CMS-managed public surface is small and path-based invalidation is easier to audit.
 *
 * Static listing pages (/, /team, /events, etc.) are pre-rendered and require explicit
 * invalidation after admin writes. Shared layout content (header, footer, announcement)
 * requires layout-scoped invalidation via `revalidatePublicLayout()`.
 */

function revalidatePage(path: string) {
  revalidatePath(path, "page");
}

function revalidateSlugDetail(route: (slug: string) => string, slug: string) {
  revalidatePage(route(slug));
}

/** Invalidate `(public)/layout.tsx` — header, footer, announcement, site settings. */
export function revalidatePublicLayout() {
  revalidatePath("/", "layout");
}

export function revalidateHomepage() {
  revalidatePage(ROUTES.home);
}

export function revalidateAbout() {
  revalidatePage(ROUTES.about);
}

export function revalidateContact() {
  revalidatePage(ROUTES.contact);
}

export function revalidateJoin() {
  revalidatePage(ROUTES.join);
}

export function revalidateEvents() {
  revalidatePage(ROUTES.events);
}

export function revalidatePublications() {
  revalidatePage(ROUTES.publications);
}

export function revalidateTeam() {
  revalidatePage(ROUTES.team);
}

/** Site settings and other changes that affect every public page shell. */
export function revalidateSiteWideContent() {
  revalidatePublicLayout();
  revalidateHomepage();
  revalidateAbout();
  revalidateContact();
  revalidateJoin();
  revalidateEvents();
  revalidatePublications();
  revalidateTeam();
}

export function revalidateTeamMember(slug: string, previousSlug?: string | null) {
  revalidateTeam();
  revalidateAbout();
  revalidateHomepage();
  revalidateSlugDetail(ROUTES.teamMember, slug);
  if (previousSlug && previousSlug !== slug) {
    revalidateSlugDetail(ROUTES.teamMember, previousSlug);
  }
}

export function revalidateEvent(slug: string, previousSlug?: string | null) {
  revalidateEvents();
  revalidateHomepage();
  revalidateSlugDetail(ROUTES.event, slug);
  if (previousSlug && previousSlug !== slug) {
    revalidateSlugDetail(ROUTES.event, previousSlug);
  }
}

export function revalidatePublication(slug: string, previousSlug?: string | null) {
  revalidatePublications();
  revalidateHomepage();
  revalidateSlugDetail(ROUTES.publication, slug);
  if (previousSlug && previousSlug !== slug) {
    revalidateSlugDetail(ROUTES.publication, previousSlug);
  }
}

export function revalidatePageContentByKey(pageKey: PageKey) {
  switch (pageKey) {
    case PageKey.HOME:
      revalidateHomepage();
      break;
    case PageKey.ABOUT:
      revalidateAbout();
      break;
    case PageKey.CONTACT:
      revalidateContact();
      break;
    case PageKey.JOIN:
      revalidateJoin();
      break;
    case PageKey.ANNOUNCEMENT:
      revalidatePublicLayout();
      revalidateHomepage();
      break;
    case PageKey.FOOTER:
    case PageKey.NAVIGATION:
      revalidateSiteWideContent();
      break;
    default:
      revalidateHomepage();
      break;
  }
}
