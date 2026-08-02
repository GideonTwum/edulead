"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { requireAdmin, logAudit } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slug";
import type { ProgrammeStatus, ProgrammeCategory, ArticleStatus } from "@prisma/client";

export async function updateSiteSettings(data: Record<string, unknown>) {
  const { profile } = await requireAdmin();
  const existing = await prisma.siteSetting.findFirst();
  const settings = existing
    ? await prisma.siteSetting.update({ where: { id: existing.id }, data: data as never })
    : await prisma.siteSetting.create({ data: data as never });

  await logAudit(profile.id, "UPDATE", "SiteSetting", settings.id);
  revalidatePath("/", "layout");
  return settings;
}

export async function updatePageContent(id: string, data: Record<string, unknown>) {
  const { profile } = await requireAdmin();
  const content = await prisma.pageContent.update({ where: { id }, data: data as never });
  await logAudit(profile.id, "UPDATE", "PageContent", id);
  revalidatePath("/", "layout");
  return content;
}

export async function createProgramme(data: {
  title: string;
  excerpt: string;
  description: string;
  category: ProgrammeCategory;
  status?: ProgrammeStatus;
  format?: string;
  targetAudience?: string;
  published?: boolean;
}) {
  const { profile } = await requireAdmin();
  const slug = await generateUniqueSlug(data.title, "programme");

  const programme = await prisma.programme.create({
    data: { ...data, slug },
  });

  await logAudit(profile.id, "CREATE", "Programme", programme.id);
  revalidatePath("/programmes");
  return programme;
}

export async function updateProgramme(id: string, data: Record<string, unknown>) {
  const { profile } = await requireAdmin();
  const programme = await prisma.programme.update({ where: { id }, data: data as never });
  await logAudit(profile.id, "UPDATE", "Programme", id);
  revalidatePath("/programmes");
  revalidatePath(`/programmes/${programme.slug}`);
  return programme;
}

export async function deleteProgramme(id: string) {
  const { profile } = await requireAdmin();
  await prisma.programme.update({ where: { id }, data: { deletedAt: new Date(), published: false } });
  await logAudit(profile.id, "DELETE", "Programme", id);
  revalidatePath("/programmes");
}

export async function updateSubmissionStatus(id: string, status: "NEW" | "REVIEWED" | "CONTACTED" | "CLOSED", note?: string) {
  const { profile } = await requireAdmin();
  await prisma.joinSubmission.update({
    where: { id },
    data: { status, ...(note ? { internalNote: note } : {}) },
  });
  await logAudit(profile.id, "UPDATE", "JoinSubmission", id);
}

export async function updateMessageStatus(id: string, status: "NEW" | "READ" | "REPLIED" | "ARCHIVED", note?: string) {
  const { profile } = await requireAdmin();
  await prisma.contactMessage.update({
    where: { id },
    data: { status, ...(note ? { internalNote: note } : {}) },
  });
  await logAudit(profile.id, "UPDATE", "ContactMessage", id);
}

export async function createArticle(data: {
  title: string;
  excerpt: string;
  content: string;
  categoryLabel?: string;
  status?: ArticleStatus;
}) {
  const { profile } = await requireAdmin();
  const slug = await generateUniqueSlug(data.title, "article");

  const article = await prisma.article.create({
    data: {
      ...data,
      slug,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    },
  });

  await logAudit(profile.id, "CREATE", "Article", article.id);
  revalidatePath("/insights");
  return article;
}

export async function updateArticle(id: string, data: Record<string, unknown>) {
  const { profile } = await requireAdmin();
  const article = await prisma.article.update({ where: { id }, data: data as never });
  await logAudit(profile.id, "UPDATE", "Article", id);
  revalidatePath("/insights");
  return article;
}

export async function createTeamMember(data: {
  fullName: string;
  role: string;
  biography: string;
  displayOrder?: number;
}) {
  const { profile } = await requireAdmin();
  const member = await prisma.teamMember.create({ data });
  await logAudit(profile.id, "CREATE", "TeamMember", member.id);
  revalidatePath("/team");
  return member;
}

export async function updateTeamMember(id: string, data: Record<string, unknown>) {
  const { profile } = await requireAdmin();
  const member = await prisma.teamMember.update({ where: { id }, data: data as never });
  await logAudit(profile.id, "UPDATE", "TeamMember", id);
  revalidatePath("/team");
  return member;
}

export async function deleteTeamMember(id: string) {
  const { profile } = await requireAdmin();
  await prisma.teamMember.delete({ where: { id } });
  await logAudit(profile.id, "DELETE", "TeamMember", id);
  revalidatePath("/team");
}

export async function unsubscribeNewsletter(id: string) {
  const { profile } = await requireAdmin();
  await prisma.newsletterSubscriber.update({
    where: { id },
    data: { active: false, unsubscribedAt: new Date() },
  });
  await logAudit(profile.id, "UPDATE", "NewsletterSubscriber", id);
}
