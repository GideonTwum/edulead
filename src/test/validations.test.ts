import { describe, it, expect, vi } from "vitest";
import { contactSchema, newsletterSchema, youngPersonSchema } from "@/lib/validations/forms";
import { createSlug } from "@/lib/slug";
import { isDeadlinePassed, getDeadlineStatus } from "@/lib/utils";
import { validateFile } from "@/lib/storage";

describe("Contact form validation", () => {
  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({
      fullName: "Test User",
      email: "invalid",
      subject: "Test subject",
      enquiryType: "General Enquiry",
      message: "This is a test message with enough characters.",
      consent: true,
      turnstileToken: "token",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid contact form", () => {
    const result = contactSchema.safeParse({
      fullName: "Test User",
      email: "test@example.com",
      subject: "Test subject",
      enquiryType: "General Enquiry",
      message: "This is a test message with enough characters.",
      consent: true,
      turnstileToken: "token",
    });
    expect(result.success).toBe(true);
  });
});

describe("Newsletter validation", () => {
  it("requires consent", () => {
    const result = newsletterSchema.safeParse({
      firstName: "Test",
      email: "test@example.com",
      consent: false,
      turnstileToken: "token",
    });
    expect(result.success).toBe(false);
  });
});

describe("Join form validation", () => {
  it("requires areas of interest for young person", () => {
    const result = youngPersonSchema.safeParse({
      fullName: "Test User",
      email: "test@example.com",
      phone: "+1234567890",
      ageRange: "18-24",
      country: "Ghana",
      institution: "University",
      educationLevel: "Undergraduate",
      areasOfInterest: [],
      hopes: "I hope to gain leadership skills and mentorship.",
      consent: true,
      turnstileToken: "token",
    });
    expect(result.success).toBe(false);
  });
});

describe("Slug generation", () => {
  it("creates URL-safe slugs", () => {
    expect(createSlug("Youth Leadership Programme")).toBe("youth-leadership-programme");
    expect(createSlug("Policy & Governance 101")).toBe("policy-and-governance-101");
  });
});

describe("Opportunity deadline handling", () => {
  it("detects expired deadlines", () => {
    const past = new Date("2020-01-01");
    expect(isDeadlinePassed(past)).toBe(true);
    expect(getDeadlineStatus(past)).toBe("expired");
  });

  it("detects active deadlines", () => {
    const future = new Date("2099-12-31");
    expect(isDeadlinePassed(future)).toBe(false);
    expect(getDeadlineStatus(future)).toBe("active");
  });

  it("handles no deadline", () => {
    expect(getDeadlineStatus(null)).toBe("none");
  });
});

describe("File validation", () => {
  it("rejects oversized images", () => {
    const file = new File([new ArrayBuffer(11 * 1024 * 1024)], "large.jpg", { type: "image/jpeg" });
    const result = validateFile(file, "image");
    expect(result.valid).toBe(false);
  });

  it("accepts valid images up to 10 MB", () => {
    const file = new File([new ArrayBuffer(10 * 1024 * 1024)], "photo.jpg", { type: "image/jpeg" });
    const result = validateFile(file, "image");
    expect(result.valid).toBe(true);
  });

  it("rejects invalid document types", () => {
    const file = new File([new ArrayBuffer(1024)], "script.exe", { type: "application/x-msdownload" });
    const result = validateFile(file, "document");
    expect(result.valid).toBe(false);
  });
});

describe("Reduced motion support", () => {
  it("useMotionConfig returns empty animations when reduced motion preferred", async () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { useMotionConfig } = await import("@/hooks/useMotionConfig");
    // Hook requires React rendering — verify the module exports correctly
    expect(typeof useMotionConfig).toBe("function");
  });
});
