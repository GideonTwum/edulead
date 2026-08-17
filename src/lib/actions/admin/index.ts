"use server";

import prisma from "@/lib/db";
import { requireAdmin, logAudit } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slug";
import {
  revalidatePublication,
  revalidateSiteWideContent,
  revalidateTeamMember,
  revalidatePageContentByKey,
} from "@/lib/revalidation";
import type { ProgrammeStatus, ProgrammeCategory, ArticleStatus } from "@prisma/client";

/** @deprecated Legacy admin actions — prefer modular files under src/lib/actions/admin/*. */

export async function updateSiteSettings(data: Record<string, unknown>) {
  const { profile } = await requireAdmin();
  const existing = await prisma.siteSetting.findFirst();
  const settings = existing
    ? await prisma.siteSetting.update({ where: { id: existing.id }, data: data as never })
    : await prisma.siteSetting.create({ data: data as never });

  await logAudit(profile.id, "UPDATE", "SiteSetting", settings.id);
  revalidateSiteWideContent();
  return settings;
}

export async function updatePageContent(id: string, data: Record<string, unknown>) {
  const { profile } = await requireAdmin();
  const content = await prisma.pageContent.update({ where: { id }, data: data as never });
  await logAudit(profile.id, "UPDATE", "PageContent", id);
  revalidatePageContentByKey(content.pageKey);
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
  return programme;
}

export async function updateProgramme(id: string, data: Record<string, unknown>) {
  const { profile } = await requireAdmin();
  const programme = await prisma.programme.update({ where: { id }, data: data as never });
  await logAudit(profile.id, "UPDATE", "Programme", id);
  return programme;
}

export async function deleteProgramme(id: string) {
  const { profile } = await requireAdmin();
  await prisma.programme.update({ where: { id }, data: { deletedAt: new Date(), published: false } });
  await logAudit(profile.id, "DELETE", "Programme", id);
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
  revalidatePublication(article.slug);
  return article;
}

export async function updateArticle(id: string, data: Record<string, unknown>) {
  const { profile } = await requireAdmin();
  const existing = await prisma.article.findFirst({ where: { id, deletedAt: null } });
  const article = await prisma.article.update({ where: { id }, data: data as never });
  await logAudit(profile.id, "UPDATE", "Article", id);
  if (existing) {
    revalidatePublication(article.slug, existing.slug);
  } else {
    revalidatePublication(article.slug);
  }
  return article;
}

export async function createTeamMember(data: {
  fullName: string;
  slug?: string;
  role?: string | null;
  biography: string;
  displayOrder?: number;
}) {
  const { profile } = await requireAdmin();
  const slug =
    data.slug ??
    data.fullName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const member = await prisma.teamMember.create({
    data: {
      fullName: data.fullName,
      slug,
      role: data.role ?? null,
      biography: data.biography,
      displayOrder: data.displayOrder ?? 0,
    },
  });
  await logAudit(profile.id, "CREATE", "TeamMember", member.id);
  revalidateTeamMember(member.slug);
  return member;
}

export async function updateTeamMember(id: string, data: Record<string, unknown>) {
  const { profile } = await requireAdmin();
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  const member = await prisma.teamMember.update({ where: { id }, data: data as never });
  await logAudit(profile.id, "UPDATE", "TeamMember", id);
  if (existing) {
    revalidateTeamMember(member.slug, existing.slug);
  } else {
    revalidateTeamMember(member.slug);
  }
  return member;
}

export async function deleteTeamMember(id: string) {
  const { profile } = await requireAdmin();
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  await prisma.teamMember.delete({ where: { id } });
  await logAudit(profile.id, "DELETE", "TeamMember", id);
  if (existing) {
    revalidateTeamMember(existing.slug);
  }
}

export async function unsubscribeNewsletter(id: string) {
  const { profile } = await requireAdmin();
  await prisma.newsletterSubscriber.update({
    where: { id },
    data: { active: false, unsubscribedAt: new Date() },
  });
  await logAudit(profile.id, "UPDATE", "NewsletterSubscriber", id);
}
