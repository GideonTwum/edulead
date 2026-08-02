"use server";

import prisma from "@/lib/db";
import { logAudit } from "@/lib/auth";
import { LocationType, OpportunityStatus, OpportunityType } from "@prisma/client";
import { generateUniqueSlug } from "@/lib/slug";
import { getAdminId } from "./shared";
import { parseDate, parseStringArray, revalidatePublicPaths, type ActionResult } from "./utils";

export async function getOpportunities() {
  await getAdminId();
  return prisma.opportunity.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getOpportunity(id: string) {
  await getAdminId();
  return prisma.opportunity.findFirst({ where: { id, deletedAt: null } });
}

export async function createOpportunity(data: Record<string, unknown>): Promise<ActionResult<{ id: string }>> {
  try {
    const adminId = await getAdminId();
    const title = data.title as string;
    const slug = await generateUniqueSlug(title, "opportunity");

    const created = await prisma.opportunity.create({
      data: {
        title,
        slug,
        organisation: (data.organisation as string) || "",
        excerpt: (data.excerpt as string) || "",
        description: (data.description as string) || "",
        opportunityType: (data.opportunityType as OpportunityType) || OpportunityType.TRAINING,
        country: (data.country as string) || null,
        locationType: (data.locationType as LocationType) || LocationType.REMOTE,
        eligibility: (data.eligibility as string) || null,
        deadline: parseDate(data.deadline as string),
        applicationUrl: (data.applicationUrl as string) || null,
        featuredImage: (data.featuredImage as string) || null,
        tags: parseStringArray(data.tags as string),
        featured: Boolean(data.featured),
        published: Boolean(data.published),
        status: (data.status as OpportunityStatus) || OpportunityStatus.ACTIVE,
        seoTitle: (data.seoTitle as string) || null,
        seoDescription: (data.seoDescription as string) || null,
      },
    });

    await logAudit(adminId, "CREATE", "Opportunity", created.id);
    await revalidatePublicPaths(["/opportunities", `/opportunities/${slug}`]);
    return { success: true, data: { id: created.id } };
  } catch {
    return { success: false, error: "Failed to create opportunity" };
  }
}

export async function updateOpportunity(id: string, data: Record<string, unknown>): Promise<ActionResult> {
  try {
    const adminId = await getAdminId();
    const title = data.title as string | undefined;
    const slug = title ? await generateUniqueSlug(title, "opportunity", id) : undefined;

    const updated = await prisma.opportunity.update({
      where: { id },
      data: {
        ...(title && { title, slug }),
        organisation: data.organisation as string | undefined,
        excerpt: data.excerpt as string | undefined,
        description: data.description as string | undefined,
        opportunityType: data.opportunityType as OpportunityType | undefined,
        country: (data.country as string) || null,
        locationType: data.locationType as LocationType | undefined,
        eligibility: (data.eligibility as string) || null,
        deadline: data.deadline !== undefined ? parseDate(data.deadline as string) : undefined,
        applicationUrl: (data.applicationUrl as string) || null,
        featuredImage: (data.featuredImage as string) || null,
        tags: data.tags !== undefined ? parseStringArray(data.tags as string) : undefined,
        featured: data.featured as boolean | undefined,
        published: data.published as boolean | undefined,
        status: data.status as OpportunityStatus | undefined,
        seoTitle: (data.seoTitle as string) || null,
        seoDescription: (data.seoDescription as string) || null,
      },
    });

    await logAudit(adminId, "UPDATE", "Opportunity", id);
    await revalidatePublicPaths(["/opportunities", `/opportunities/${updated.slug}`]);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update opportunity" };
  }
}

export async function deleteOpportunity(id: string): Promise<ActionResult> {
  try {
    const adminId = await getAdminId();
    await prisma.opportunity.update({ where: { id }, data: { deletedAt: new Date(), published: false } });
    await logAudit(adminId, "DELETE", "Opportunity", id);
    await revalidatePublicPaths(["/opportunities"]);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete opportunity" };
  }
}
