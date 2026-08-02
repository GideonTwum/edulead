"use server";

import { requireAdmin } from "@/lib/auth";

export async function getAdminId() {
  const { profile } = await requireAdmin();
  return profile.id;
}
