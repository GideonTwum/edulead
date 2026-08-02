"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/auth";
import { sanitizeAdminRedirect, ADMIN_ACCESS_DENIED_MESSAGE } from "@/lib/auth/admin-access";
import prisma from "@/lib/db";
import { ROUTES } from "@/lib/constants";

const GENERIC_AUTH_ERROR = "Invalid email or password";

function formatAuthError(error: { code?: string; status?: number; message?: string }) {
  if (process.env.NODE_ENV === "development") {
    console.error("[admin login]", {
      code: error.code,
      status: error.status,
      message: error.message,
    });
    return error.message || GENERIC_AUTH_ERROR;
  }

  return GENERIC_AUTH_ERROR;
}

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || ROUTES.admin.dashboard;

  if (!email || !password) {
    return { success: false as const, error: "Email and password are required" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false as const, error: formatAuthError(error) };
  }

  const profile = await prisma.adminProfile.findUnique({
    where: { userId: data.user.id },
  });

  if (!profile || !profile.active) {
    await supabase.auth.signOut();
    return { success: false as const, error: ADMIN_ACCESS_DENIED_MESSAGE };
  }

  await logAudit(profile.id, "LOGIN", "AdminProfile", profile.id);
  redirect(sanitizeAdminRedirect(redirectTo));
}

export async function logoutAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profile = await prisma.adminProfile.findUnique({ where: { userId: user.id } });
    if (profile) {
      await logAudit(profile.id, "LOGOUT", "AdminProfile", profile.id);
    }
  }

  await supabase.auth.signOut();
  redirect(ROUTES.admin.login);
}
