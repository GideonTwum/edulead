import { describe, it, expect, vi, beforeEach } from "vitest";
import { PageKey } from "@prisma/client";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { revalidatePath } from "next/cache";
import {
  revalidateEvent,
  revalidateHomepage,
  revalidatePageContentByKey,
  revalidatePublication,
  revalidateSiteWideContent,
  revalidateTeamMember,
} from "@/lib/revalidation";

describe("CMS revalidation helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("revalidateTeamMember invalidates listing, about, homepage, and detail paths", () => {
    revalidateTeamMember("jane-doe");

    expect(revalidatePath).toHaveBeenCalledWith("/team", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/about", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/team/jane-doe", "page");
  });

  it("revalidateTeamMember invalidates old and new slug paths on slug change", () => {
    revalidateTeamMember("jane-doe", "old-slug");

    expect(revalidatePath).toHaveBeenCalledWith("/team/old-slug", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/team/jane-doe", "page");
  });

  it("revalidateEvent invalidates events listing, homepage, and detail route", () => {
    revalidateEvent("expo-2026");

    expect(revalidatePath).toHaveBeenCalledWith("/events", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/events/expo-2026", "page");
  });

  it("revalidateEvent invalidates old and new slug paths on slug change", () => {
    revalidateEvent("new-expo", "old-expo");

    expect(revalidatePath).toHaveBeenCalledWith("/events/old-expo", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/events/new-expo", "page");
  });

  it("revalidatePublication invalidates publications listing, homepage, and detail route", () => {
    revalidatePublication("sample-article");

    expect(revalidatePath).toHaveBeenCalledWith("/publications", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/publications/sample-article", "page");
    expect(revalidatePath).not.toHaveBeenCalledWith("/insights", "page");
    expect(revalidatePath).not.toHaveBeenCalledWith(expect.stringContaining("/insights/"), "page");
  });

  it("revalidatePageContentByKey maps HOME to homepage", () => {
    revalidatePageContentByKey(PageKey.HOME);
    expect(revalidatePath).toHaveBeenCalledWith("/", "page");
  });

  it("revalidatePageContentByKey maps ABOUT to /about", () => {
    revalidatePageContentByKey(PageKey.ABOUT);
    expect(revalidatePath).toHaveBeenCalledWith("/about", "page");
  });

  it("revalidatePageContentByKey maps CONTACT to /contact", () => {
    revalidatePageContentByKey(PageKey.CONTACT);
    expect(revalidatePath).toHaveBeenCalledWith("/contact", "page");
  });

  it("revalidatePageContentByKey maps ANNOUNCEMENT to layout and homepage", () => {
    revalidatePageContentByKey(PageKey.ANNOUNCEMENT);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(revalidatePath).toHaveBeenCalledWith("/", "page");
  });

  it("revalidateSiteWideContent invalidates layout and all static public listing pages", () => {
    revalidateSiteWideContent();

    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(revalidatePath).toHaveBeenCalledWith("/", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/about", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/contact", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/join", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/events", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/publications", "page");
    expect(revalidatePath).toHaveBeenCalledWith("/team", "page");
  });

  it("revalidateHomepage only invalidates the homepage page cache", () => {
    revalidateHomepage();
    expect(revalidatePath).toHaveBeenCalledWith("/", "page");
    expect(revalidatePath).not.toHaveBeenCalledWith("/", "layout");
  });
});
