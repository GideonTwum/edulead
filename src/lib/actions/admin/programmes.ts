"use server";

import prisma from "@/lib/db";
import { logAudit } from "@/lib/auth";
import { ProgrammeCategory, ProgrammeStatus } from "@prisma/client";
import { generateUniqueSlug } from "@/lib/slug";
import { getAdminId } from "./shared";
import { parseDate, revalidatePublicPaths, type ActionResult } from "./utils";

export async function getProgrammes() {
  await getAdminId();
  return prisma.programme.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProgramme(id: string) {
  await getAdminId();
  return prisma.programme.findFirst({
    where: { id, deletedAt: null },
    include: { interests: { orderBy: { createdAt: "desc" } } },
  });
}

export async function createProgramme(data: Record<string, unknown>): Promise<ActionResult<{ id: string }>> {
  try {
    const adminId = await getAdminId();
    const title = data.title as string;
    const slug = await generateUniqueSlug(title, "programme");

    const created = await prisma.programme.create({
      data: {
        title,
        slug,
        excerpt: (data.excerpt as string) || "",
        description: (data.description as string) || "",
        featuredImage: (data.featuredImage as string) || null,
        category: (data.category as ProgrammeCategory) || ProgrammeCategory.MENTORSHIP_COACHING,
        format: (data.format as string) || null,
        targetAudience: (data.targetAudience as string) || null,
        location: (data.location as string) || null,
        startDate: parseDate(data.startDate as string),
        endDate: parseDate(data.endDate as string),
        applicationDeadline: parseDate(data.applicationDeadline as string),
        externalApplicationUrl: (data.externalApplicationUrl as string) || null,
        contactEmail: (data.contactEmail as string) || null,
        interestFormEnabled: data.interestFormEnabled !== false,
        status: (data.status as ProgrammeStatus) || ProgrammeStatus.PLANNED,
        featured: Boolean(data.featured),
        published: Boolean(data.published),
        objectives: (data.objectives as string) || null,
        expectations: (data.expectations as string) || null,
        whoIsItFor: (data.whoIsItFor as string) || null,
        timeline: (data.timeline as string) || null,
        seoTitle: (data.seoTitle as string) || null,
        seoDescription: (data.seoDescription as string) || null,
      },
    });

    await logAudit(adminId, "CREATE", "Programme", created.id);
    await revalidatePublicPaths(["/programmes", `/programmes/${slug}`]);
    return { success: true, data: { id: created.id } };
  } catch {
    return { success: false, error: "Failed to create programme" };
  }
}

export async function updateProgramme(id: string, data: Record<string, unknown>): Promise<ActionResult> {
  try {
    const adminId = await getAdminId();
    const title = data.title as string | undefined;
    const slug = title ? await generateUniqueSlug(title, "programme", id) : undefined;

    const updated = await prisma.programme.update({
      where: { id },
      data: {
        ...(title && { title, slug }),
        excerpt: data.excerpt as string | undefined,
        description: data.description as string | undefined,
        featuredImage: (data.featuredImage as string) || null,
        category: data.category as ProgrammeCategory | undefined,
        format: (data.format as string) || null,
        targetAudience: (data.targetAudience as string) || null,
        location: (data.location as string) || null,
        startDate: data.startDate !== undefined ? parseDate(data.startDate as string) : undefined,
        endDate: data.endDate !== undefined ? parseDate(data.endDate as string) : undefined,
        applicationDeadline:
          data.applicationDeadline !== undefined ? parseDate(data.applicationDeadline as string) : undefined,
        externalApplicationUrl: (data.externalApplicationUrl as string) || null,
        contactEmail: (data.contactEmail as string) || null,
        interestFormEnabled: data.interestFormEnabled as boolean | undefined,
        status: data.status as ProgrammeStatus | undefined,
        featured: data.featured as boolean | undefined,
        published: data.published as boolean | undefined,
        objectives: (data.objectives as string) || null,
        expectations: (data.expectations as string) || null,
        whoIsItFor: (data.whoIsItFor as string) || null,
        timeline: (data.timeline as string) || null,
        seoTitle: (data.seoTitle as string) || null,
        seoDescription: (data.seoDescription as string) || null,
      },
    });

    await logAudit(adminId, "UPDATE", "Programme", id);
    await revalidatePublicPaths(["/programmes", `/programmes/${updated.slug}`]);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update programme" };
  }
}

export async function deleteProgramme(id: string): Promise<ActionResult> {
  try {
    const adminId = await getAdminId();
    await prisma.programme.update({ where: { id }, data: { deletedAt: new Date(), published: false } });
    await logAudit(adminId, "DELETE", "Programme", id);
    await revalidatePublicPaths(["/programmes"]);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete programme" };
  }
}

export async function updateProgrammeInterestStatus(
  id: string,
  status: string,
  internalNote?: string,
): Promise<ActionResult> {
  try {
    await getAdminId();
    await prisma.programmeInterest.update({
      where: { id },
      data: { status: status as "NEW" | "REVIEWED" | "CONTACTED" | "CLOSED", internalNote: internalNote || null },
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update interest status" };
  }
}
