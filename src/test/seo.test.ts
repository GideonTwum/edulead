import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  buildPageMetadata,
  collectSameAsUrls,
  truncateDescription,
  SEO,
} from "@/lib/seo";

describe("seo utilities", () => {
  it("truncates long descriptions cleanly", () => {
    const long = "A".repeat(200);
    const result = truncateDescription(long, 160);
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith("…")).toBe(true);
  });

  it("builds absolute URLs from paths", () => {
    expect(absoluteUrl("/about")).toContain("/about");
    expect(absoluteUrl("about")).toContain("/about");
  });

  it("builds page metadata with canonical and twitter cards", () => {
    const metadata = buildPageMetadata({
      title: "About EduLead Network | Developing the Next Generation of Leaders",
      description: SEO.defaultDescription,
      path: "/about",
      useAbsoluteTitle: true,
    });

    expect(metadata.alternates?.canonical).toContain("/about");
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect(metadata.openGraph?.url).toContain("/about");
  });

  it("collects verified social URLs only", () => {
    const urls = collectSameAsUrls({
      linkedinUrl: "https://linkedin.com/company/edulead",
      twitterUrl: "",
      instagramUrl: null,
    });

    expect(urls).toEqual(["https://linkedin.com/company/edulead"]);
  });
});
