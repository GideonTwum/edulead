import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  buildAdminLoginUrl,
  isAdminLoginPath,
  shouldRedirectUnauthenticatedToLogin,
} from "@/lib/auth/admin-access";

function createRequestWithPathname(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return requestHeaders;
}

export async function middleware(request: NextRequest) {
  const requestHeaders = createRequestWithPathname(request);
  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (shouldRedirectUnauthenticatedToLogin(request.nextUrl.pathname, false)) {
      return NextResponse.redirect(buildAdminLoginUrl(request.url, request.nextUrl.pathname));
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request: { headers: requestHeaders },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (shouldRedirectUnauthenticatedToLogin(pathname, Boolean(user))) {
    return NextResponse.redirect(buildAdminLoginUrl(request.url, pathname));
  }

  // Authenticated users without admin access remain on the login page.
  // Valid admin redirects are handled server-side after AdminProfile checks.
  if (isAdminLoginPath(pathname)) {
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
