import type { Metadata } from "next";

/** Stable, crawlable favicon paths for Google Search and browsers. */
export const FAVICON = {
  ico: "/favicon.ico",
  png: "/icon.png",
  apple: "/apple-icon.png",
} as const;

/**
 * Root favicon metadata — single source of truth.
 * Do not override from CMS unless a validated production asset replaces all sizes.
 */
export const ROOT_FAVICON_METADATA: Metadata["icons"] = {
  icon: [
    { url: FAVICON.ico },
    { url: FAVICON.png, type: "image/png", sizes: "512x512" },
  ],
  shortcut: FAVICON.ico,
  apple: [{ url: FAVICON.apple, sizes: "180x180", type: "image/png" }],
};

/**
 * Returns CMS favicon icons only when faviconUrl is a valid same-origin static path.
 * Rejects empty values, external URLs, and wordmark logo fallbacks that are unsuitable
 * as favicons for Google Search.
 */
export function resolveCmsFaviconIcons(faviconUrl?: string | null): Metadata["icons"] | null {
  if (!faviconUrl?.trim()) return null;

  const url = faviconUrl.trim();

  // Only allow local static paths — never external or Supabase signed URLs for favicons
  if (!url.startsWith("/")) return null;

  // Reject full wordmark logo — unsuitable at favicon sizes
  if (url === "/logo.jpeg" || url.endsWith("/logo.jpeg")) return null;

  const isIconCandidate =
    url.endsWith(".ico") ||
    url.endsWith(".png") ||
    url.endsWith(".webp") ||
    url.includes("favicon") ||
    url.includes("icon");

  if (!isIconCandidate) return null;

  return {
    icon: [{ url }, ...(url.endsWith(".ico") ? [] : [{ url: FAVICON.ico }])],
    shortcut: url.endsWith(".ico") ? url : FAVICON.ico,
    apple: url.endsWith(".png")
      ? [{ url, type: "image/png" }]
      : [{ url: FAVICON.apple, sizes: "180x180", type: "image/png" }],
  };
}
