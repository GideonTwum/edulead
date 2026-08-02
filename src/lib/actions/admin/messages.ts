"use server";

import prisma from "@/lib/db";
import { getAdminId } from "./shared";
import { type ActionResult } from "./utils";

export async function getContactMessages() {
  await getAdminId();
  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getContactMessage(id: string) {
  await getAdminId();
  return prisma.contactMessage.findUnique({ where: { id } });
}

export async function updateContactMessageStatus(
  id: string,
  status: string,
  internalNote?: string,
): Promise<ActionResult> {
  try {
    await getAdminId();
    await prisma.contactMessage.update({
      where: { id },
      data: { status: status as "NEW" | "READ" | "REPLIED" | "ARCHIVED", internalNote: internalNote || null },
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update message" };
  }
}
