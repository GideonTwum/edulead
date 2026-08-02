"use server";

import prisma from "@/lib/db";
import { logAudit } from "@/lib/auth";
import { getAdminId } from "./shared";
import { revalidatePublicPaths, type ActionResult } from "./utils";

export async function getTeamMembers() {
  await getAdminId();
  return prisma.teamMember.findMany({ orderBy: { displayOrder: "asc" } });
}

export async function getTeamMember(id: string) {
  await getAdminId();
  return prisma.teamMember.findUnique({ where: { id } });
}

export async function createTeamMember(data: Record<string, unknown>): Promise<ActionResult<{ id: string }>> {
  try {
    const adminId = await getAdminId();
    const created = await prisma.teamMember.create({
      data: {
        fullName: data.fullName as string,
        role: (data.role as string) || "",
        biography: (data.biography as string) || "",
        profileImage: (data.profileImage as string) || null,
        linkedinUrl: (data.linkedinUrl as string) || null,
        email: (data.email as string) || null,
        showEmail: Boolean(data.showEmail),
        displayOrder: Number(data.displayOrder) || 0,
        active: data.active !== false,
      },
    });
    await logAudit(adminId, "CREATE", "TeamMember", created.id);
    await revalidatePublicPaths(["/team"]);
    return { success: true, data: { id: created.id } };
  } catch {
    return { success: false, error: "Failed to create team member" };
  }
}

export async function updateTeamMember(id: string, data: Record<string, unknown>): Promise<ActionResult> {
  try {
    const adminId = await getAdminId();
    await prisma.teamMember.update({
      where: { id },
      data: {
        fullName: data.fullName as string | undefined,
        role: data.role as string | undefined,
        biography: data.biography as string | undefined,
        profileImage: (data.profileImage as string) || null,
        linkedinUrl: (data.linkedinUrl as string) || null,
        email: (data.email as string) || null,
        showEmail: data.showEmail as boolean | undefined,
        displayOrder: data.displayOrder !== undefined ? Number(data.displayOrder) : undefined,
        active: data.active as boolean | undefined,
      },
    });
    await logAudit(adminId, "UPDATE", "TeamMember", id);
    await revalidatePublicPaths(["/team"]);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update team member" };
  }
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  try {
    const adminId = await getAdminId();
    await prisma.teamMember.delete({ where: { id } });
    await logAudit(adminId, "DELETE", "TeamMember", id);
    await revalidatePublicPaths(["/team"]);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete team member" };
  }
}
