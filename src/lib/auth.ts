import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/db";
import { ROUTES } from "@/lib/constants";
import {
  ADMIN_ACCESS_DENIED_QUERY,
  isProtectedAdminPath,
  sanitizeAdminRedirect,
} from "@/lib/auth/admin-access";

function redirectToAdminLogin(options?: { redirectPath?: string; denied?: boolean }): never {
  const params = new URLSearchParams();
  if (options?.redirectPath && isProtectedAdminPath(options.redirectPath)) {
    params.set("redirect", sanitizeAdminRedirect(options.redirectPath));
  }
  if (options?.denied) {
    params.set("error", ADMIN_ACCESS_DENIED_QUERY);
  }
  const query = params.toString();
  redirect(query ? `${ROUTES.admin.login}?${query}` : ROUTES.admin.login);
}

export async function getSession() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getAdminProfile() {
  const user = await getSession();
  if (!user) return null;

  const profile = await prisma.adminProfile.findUnique({
    where: { userId: user.id },
  });

  if (!profile || !profile.active) return null;
  return { user, profile };
}

export async function requireAdmin(redirectPath?: string) {
  const user = await getSession();

  if (!user) {
    redirectToAdminLogin({ redirectPath });
  }

  const profile = await prisma.adminProfile.findUnique({
    where: { userId: user.id },
  });

  if (!profile || !profile.active) {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirectToAdminLogin({ redirectPath, denied: true });
  }

  return { user, profile };
}

export async function redirectIfAuthenticatedAdmin(redirectTo?: string | null) {
  const admin = await getAdminProfile();
  if (!admin) return;

  redirect(sanitizeAdminRedirect(redirectTo));
}

export async function logAudit(
  adminId: string | null,
  action: "CREATE" | "UPDATE" | "DELETE" | "PUBLISH" | "UNPUBLISH" | "LOGIN" | "LOGOUT",
  entityType: string,
  entityId?: string,
  details?: Record<string, unknown>,
) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: adminId ?? undefined,
        action,
        entityType,
        entityId,
        details: details ? (details as object) : undefined,
      },
    });
  } catch {
    // Non-blocking
  }
}
