import { describe, expect, it } from "vitest";
import { FAVICON, resolveCmsFaviconIcons } from "@/lib/favicon";

describe("favicon utilities", () => {
  it("exposes stable crawlable favicon paths", () => {
    expect(FAVICON.ico).toBe("/favicon.ico");
    expect(FAVICON.png).toBe("/icon.png");
    expect(FAVICON.apple).toBe("/apple-icon.png");
  });

  it("rejects empty CMS favicon values", () => {
    expect(resolveCmsFaviconIcons(null)).toBeNull();
    expect(resolveCmsFaviconIcons("")).toBeNull();
  });

  it("rejects external CMS favicon URLs", () => {
    expect(resolveCmsFaviconIcons("https://example.com/favicon.ico")).toBeNull();
  });

  it("rejects wordmark logo as favicon", () => {
    expect(resolveCmsFaviconIcons("/logo.jpeg")).toBeNull();
  });

  it("accepts valid local icon paths", () => {
    const icons = resolveCmsFaviconIcons("/branding/favicon.png");
    expect(icons).not.toBeNull();
    expect(icons && typeof icons === "object" && "icon" in icons).toBe(true);
  });
});
