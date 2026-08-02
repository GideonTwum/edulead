"use server";

import prisma from "@/lib/db";
import { getAdminId } from "./shared";
import { type ActionResult } from "./utils";

export async function getJoinSubmissions() {
  await getAdminId();
  return prisma.joinSubmission.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getJoinSubmission(id: string) {
  await getAdminId();
  return prisma.joinSubmission.findUnique({ where: { id } });
}

export async function updateJoinSubmissionStatus(
  id: string,
  status: string,
  internalNote?: string,
): Promise<ActionResult> {
  try {
    await getAdminId();
    await prisma.joinSubmission.update({
      where: { id },
      data: { status: status as "NEW" | "REVIEWED" | "CONTACTED" | "CLOSED", internalNote: internalNote || null },
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update submission" };
  }
}
