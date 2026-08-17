import { describe, it, expect } from "vitest";
import {
  PUBLIC_NAV_LINKS,
  JOIN_MOVEMENT_CTA,
  isNavLinkActive,
} from "@/lib/navigation/public-nav";
import { ROUTES } from "@/lib/constants";

describe("public navigation config", () => {
  it("exposes simplified primary navigation", () => {
    const labels = PUBLIC_NAV_LINKS.map((item) => item.label);
    expect(labels).toEqual([
      "Home",
      "About",
      "Events & Media",
      "Publications",
      "Team",
      "Contact",
    ]);
  });

  it("does not include programmes or opportunities", () => {
    const hrefs = PUBLIC_NAV_LINKS.map((item) => item.href);
    expect(hrefs).not.toContain(ROUTES.programmes);
    expect(hrefs).not.toContain(ROUTES.opportunities);
  });

  it("detects active nav links", () => {
    expect(isNavLinkActive("/", ROUTES.home)).toBe(true);
    expect(isNavLinkActive("/about", ROUTES.about)).toBe(true);
    expect(isNavLinkActive("/events/sample", ROUTES.events)).toBe(true);
    expect(isNavLinkActive("/publications/sample", ROUTES.publications)).toBe(true);
    expect(isNavLinkActive("/team/elizabeth-dansoa-osei", ROUTES.team)).toBe(true);
  });

  it("keeps join CTA separate from primary nav", () => {
    expect(JOIN_MOVEMENT_CTA.href).toBe(ROUTES.join);
    expect(PUBLIC_NAV_LINKS.some((item) => item.href === ROUTES.join)).toBe(false);
  });
});
