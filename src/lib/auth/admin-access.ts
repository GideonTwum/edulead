import { ROUTES } from "@/lib/constants";

export const ADMIN_ACCESS_DENIED_MESSAGE = "You do not have admin access.";
export const ADMIN_ACCESS_DENIED_QUERY = "no_access";

export function isAdminLoginPath(pathname: string): boolean {
  return pathname === ROUTES.admin.login;
}

export function isProtectedAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin") && !isAdminLoginPath(pathname);
}

export function sanitizeAdminRedirect(
  path: string | null | undefined,
  fallback: string = ROUTES.admin.dashboard,
): string {
  if (!path || !path.startsWith("/admin") || path.startsWith("//")) {
    return fallback;
  }
  return path;
}

export function shouldRedirectUnauthenticatedToLogin(
  pathname: string,
  hasUser: boolean,
): boolean {
  return isProtectedAdminPath(pathname) && !hasUser;
}

export function buildAdminLoginUrl(
  requestUrl: string,
  redirectPath?: string,
  error?: typeof ADMIN_ACCESS_DENIED_QUERY,
): URL {
  const url = new URL(ROUTES.admin.login, requestUrl);
  if (redirectPath && isProtectedAdminPath(redirectPath)) {
    url.searchParams.set("redirect", sanitizeAdminRedirect(redirectPath));
  }
  if (error) {
    url.searchParams.set("error", error);
  }
  return url;
}

export function getAdminAccessErrorMessage(errorParam: string | null): string | null {
  if (errorParam === ADMIN_ACCESS_DENIED_QUERY) {
    return ADMIN_ACCESS_DENIED_MESSAGE;
  }
  return null;
}
