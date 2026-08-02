"use server";

import prisma from "@/lib/db";
import { logAudit } from "@/lib/auth";
import { ArticleStatus } from "@prisma/client";
import { generateUniqueSlug } from "@/lib/slug";
import { getAdminId } from "./shared";
import { parseDate, parseStringArray, revalidatePublicPaths, type ActionResult } from "./utils";

export async function getArticles() {
  await getAdminId();
  return prisma.article.findMany({
    where: { deletedAt: null },
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });
}

export async function getArticle(id: string) {
  await getAdminId();
  return prisma.article.findFirst({
    where: { id, deletedAt: null },
    include: { category: true },
  });
}

export async function getArticleCategories() {
  await getAdminId();
  return prisma.articleCategory.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function createArticle(data: Record<string, unknown>): Promise<ActionResult<{ id: string }>> {
  try {
    const adminId = await getAdminId();
    const title = data.title as string;
    const slug = await generateUniqueSlug(title, "article");
    const status = (data.status as ArticleStatus) || ArticleStatus.DRAFT;
    const published = status === ArticleStatus.PUBLISHED;

    const created = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt: (data.excerpt as string) || "",
        content: (data.content as string) || "",
        featuredImage: (data.featuredImage as string) || null,
        authorName: (data.authorName as string) || null,
        authorImage: (data.authorImage as string) || null,
        categoryId: (data.categoryId as string) || null,
        categoryLabel: (data.categoryLabel as string) || null,
        tags: parseStringArray(data.tags as string),
        readingTime: data.readingTime ? Number(data.readingTime) : null,
        downloadableFile: (data.downloadableFile as string) || null,
        seoTitle: (data.seoTitle as string) || null,
        seoDescription: (data.seoDescription as string) || null,
        featured: Boolean(data.featured),
        status,
        publishedAt: published ? parseDate(data.publishedAt as string) || new Date() : null,
      },
    });

    await logAudit(adminId, "CREATE", "Article", created.id);
    await revalidatePublicPaths(["/insights", `/insights/${slug}`]);
    return { success: true, data: { id: created.id } };
  } catch {
    return { success: false, error: "Failed to create article" };
  }
}

export async function updateArticle(id: string, data: Record<string, unknown>): Promise<ActionResult> {
  try {
    const adminId = await getAdminId();
    const title = data.title as string | undefined;
    const slug = title ? await generateUniqueSlug(title, "article", id) : undefined;
    const status = data.status as ArticleStatus | undefined;
    const publishedAt =
      status === ArticleStatus.PUBLISHED
        ? parseDate(data.publishedAt as string) || new Date()
        : status
          ? null
          : undefined;

    const updated = await prisma.article.update({
      where: { id },
      data: {
        ...(title && { title, slug }),
        excerpt: data.excerpt as string | undefined,
        content: data.content as string | undefined,
        featuredImage: (data.featuredImage as string) || null,
        authorName: (data.authorName as string) || null,
        authorImage: (data.authorImage as string) || null,
        categoryId: (data.categoryId as string) || null,
        categoryLabel: (data.categoryLabel as string) || null,
        tags: data.tags !== undefined ? parseStringArray(data.tags as string) : undefined,
        readingTime: data.readingTime !== undefined ? (data.readingTime ? Number(data.readingTime) : null) : undefined,
        downloadableFile: (data.downloadableFile as string) || null,
        seoTitle: (data.seoTitle as string) || null,
        seoDescription: (data.seoDescription as string) || null,
        featured: data.featured as boolean | undefined,
        status,
        publishedAt,
      },
    });

    await logAudit(adminId, "UPDATE", "Article", id);
    await revalidatePublicPaths(["/insights", `/insights/${updated.slug}`]);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update article" };
  }
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  try {
    const adminId = await getAdminId();
    await prisma.article.update({ where: { id }, data: { deletedAt: new Date(), status: ArticleStatus.ARCHIVED } });
    await logAudit(adminId, "DELETE", "Article", id);
    await revalidatePublicPaths(["/insights"]);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete article" };
  }
}
