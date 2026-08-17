"use server";

import prisma from "@/lib/db";
import { logAudit } from "@/lib/auth";
import { PageKey } from "@prisma/client";
import { revalidatePageContentByKey } from "@/lib/revalidation";
import { getAdminId } from "./shared";
import type { ActionResult } from "./utils";

export async function getPageContents(pageKey?: PageKey) {
  await getAdminId();
  return prisma.pageContent.findMany({
    where: pageKey ? { pageKey } : undefined,
    orderBy: [{ pageKey: "asc" }, { sortOrder: "asc" }],
  });
}

export async function updatePageContent(id: string, data: {
  heading?: string | null;
  subheading?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
  visible?: boolean;
  published?: boolean;
  sortOrder?: number;
}): Promise<ActionResult> {
  try {
    const adminId = await getAdminId();
    const updated = await prisma.pageContent.update({ where: { id }, data });
    await logAudit(adminId, "UPDATE", "PageContent", id, { pageKey: updated.pageKey });
    revalidatePageContentByKey(updated.pageKey);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update page content" };
  }
}

export async function createPageContent(data: {
  pageKey: PageKey;
  sectionKey: string;
  heading?: string;
  subheading?: string;
  body?: string;
  sortOrder?: number;
}): Promise<ActionResult<{ id: string }>> {
  try {
    const adminId = await getAdminId();
    const created = await prisma.pageContent.create({ data });
    await logAudit(adminId, "CREATE", "PageContent", created.id);
    revalidatePageContentByKey(created.pageKey);
    return { success: true, data: { id: created.id } };
  } catch {
    return { success: false, error: "Failed to create page content" };
  }
}
