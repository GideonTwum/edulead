import { describe, it, expect } from "vitest";
import {
  ADMIN_ACCESS_DENIED_MESSAGE,
  ADMIN_ACCESS_DENIED_QUERY,
  buildAdminLoginUrl,
  getAdminAccessErrorMessage,
  isAdminLoginPath,
  isProtectedAdminPath,
  sanitizeAdminRedirect,
  shouldRedirectUnauthenticatedToLogin,
} from "@/lib/auth/admin-access";
import { ROUTES } from "@/lib/constants";

describe("admin access helpers", () => {
  it("identifies login and protected admin paths", () => {
    expect(isAdminLoginPath("/admin/login")).toBe(true);
    expect(isAdminLoginPath("/admin/dashboard")).toBe(false);
    expect(isProtectedAdminPath("/admin/dashboard")).toBe(true);
    expect(isProtectedAdminPath("/admin/login")).toBe(false);
  });

  it("redirects unauthenticated users away from protected admin routes only", () => {
    expect(shouldRedirectUnauthenticatedToLogin("/admin/dashboard", false)).toBe(true);
    expect(shouldRedirectUnauthenticatedToLogin("/admin/login", false)).toBe(false);
    expect(shouldRedirectUnauthenticatedToLogin("/admin/dashboard", true)).toBe(false);
    expect(shouldRedirectUnauthenticatedToLogin("/admin/login", true)).toBe(false);
  });

  it("sanitizes admin redirect targets", () => {
    expect(sanitizeAdminRedirect("/admin/dashboard")).toBe("/admin/dashboard");
    expect(sanitizeAdminRedirect("/admin/programmes/abc")).toBe("/admin/programmes/abc");
    expect(sanitizeAdminRedirect("https://evil.com/admin/dashboard")).toBe(ROUTES.admin.dashboard);
    expect(sanitizeAdminRedirect("//evil.com/admin")).toBe(ROUTES.admin.dashboard);
    expect(sanitizeAdminRedirect(undefined)).toBe(ROUTES.admin.dashboard);
  });

  it("builds safe login URLs with redirect and access errors", () => {
    const loginUrl = buildAdminLoginUrl(
      "http://localhost:3000/admin/dashboard",
      "/admin/dashboard",
      ADMIN_ACCESS_DENIED_QUERY,
    );

    expect(loginUrl.pathname).toBe("/admin/login");
    expect(loginUrl.searchParams.get("redirect")).toBe("/admin/dashboard");
    expect(loginUrl.searchParams.get("error")).toBe(ADMIN_ACCESS_DENIED_QUERY);
  });

  it("ignores unsafe redirect targets when building login URLs", () => {
    const loginUrl = buildAdminLoginUrl("http://localhost:3000/admin/login", "https://evil.com");
    expect(loginUrl.searchParams.get("redirect")).toBeNull();
  });

  it("maps access denied query values to a safe message", () => {
    expect(getAdminAccessErrorMessage(ADMIN_ACCESS_DENIED_QUERY)).toBe(ADMIN_ACCESS_DENIED_MESSAGE);
    expect(getAdminAccessErrorMessage("other")).toBeNull();
    expect(getAdminAccessErrorMessage(null)).toBeNull();
  });

  it("prevents redirect loops by allowing authenticated non-admins to stay on login", () => {
    expect(shouldRedirectUnauthenticatedToLogin("/admin/login", true)).toBe(false);
  });
});

describe("admin authorization scenarios", () => {
  it("unauthenticated user is sent to login for protected routes", () => {
    expect(shouldRedirectUnauthenticatedToLogin("/admin/settings", false)).toBe(true);
  });

  it("valid active admin path remains accessible without forced login redirect", () => {
    expect(shouldRedirectUnauthenticatedToLogin("/admin/dashboard", true)).toBe(false);
  });

  it("authenticated user without AdminProfile can remain on login route", () => {
    expect(isAdminLoginPath("/admin/login")).toBe(true);
    expect(shouldRedirectUnauthenticatedToLogin("/admin/login", true)).toBe(false);
  });

  it("inactive admin login attempts receive the safe access denied message", () => {
    expect(getAdminAccessErrorMessage(ADMIN_ACCESS_DENIED_QUERY)).toBe(
      "You do not have admin access.",
    );
  });

  it("preserves safe redirect parameters only for /admin routes", () => {
    expect(sanitizeAdminRedirect("/admin/events/123")).toBe("/admin/events/123");
    expect(sanitizeAdminRedirect("/public/contact")).toBe(ROUTES.admin.dashboard);
  });
});
