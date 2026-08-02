import { describe, it, expect } from "vitest";
import {
  PROGRAMMES_DROPDOWN,
  RESOURCES_DROPDOWN,
  isContactLinkActive,
  isPrimaryLinkActive,
} from "@/lib/navigation/public-nav";
import { ROUTES } from "@/lib/constants";

describe("public navigation config", () => {
  it("marks programmes dropdown active for programme routes", () => {
    expect(PROGRAMMES_DROPDOWN.isActive(ROUTES.programmes)).toBe(true);
    expect(PROGRAMMES_DROPDOWN.isActive("/programmes/youth-leadership-mentorship-programme")).toBe(true);
    expect(PROGRAMMES_DROPDOWN.isActive(ROUTES.opportunities)).toBe(false);
  });

  it("marks resources dropdown active for resource routes", () => {
    expect(RESOURCES_DROPDOWN.isActive(ROUTES.opportunities)).toBe(true);
    expect(RESOURCES_DROPDOWN.isActive("/events/sample-event")).toBe(true);
    expect(RESOURCES_DROPDOWN.isActive(ROUTES.insights)).toBe(true);
    expect(RESOURCES_DROPDOWN.isActive(ROUTES.team)).toBe(true);
    expect(RESOURCES_DROPDOWN.isActive(ROUTES.programmes)).toBe(false);
  });

  it("detects active primary links", () => {
    expect(isPrimaryLinkActive("/", "/")).toBe(true);
    expect(isPrimaryLinkActive("/about", ROUTES.about)).toBe(true);
    expect(isPrimaryLinkActive("/", ROUTES.about)).toBe(false);
  });

  it("detects active contact link", () => {
    expect(isContactLinkActive(ROUTES.contact)).toBe(true);
    expect(isContactLinkActive(ROUTES.join)).toBe(false);
  });

  it("includes seeded programme destinations", () => {
    const hrefs = PROGRAMMES_DROPDOWN.items.map((item) => item.href);
    expect(hrefs).toContain("/programmes/youth-leadership-mentorship-programme");
    expect(hrefs).toContain("/programmes/youth-policy-dialogue-series");
    expect(hrefs).toContain(ROUTES.join);
  });

  it("keeps opportunities under resources", () => {
    const hrefs = RESOURCES_DROPDOWN.items.map((item) => item.href);
    expect(hrefs).toContain(ROUTES.opportunities);
    expect(hrefs).not.toContain(ROUTES.join);
  });
});
