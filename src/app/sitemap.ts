import type { MetadataRoute } from "next";
import prisma from "@/lib/db";
import { env } from "@/lib/env";
import { ROUTES } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.siteUrl;

  const staticPages = [
    ROUTES.home,
    ROUTES.about,
    ROUTES.events,
    ROUTES.publications,
    ROUTES.team,
    ROUTES.join,
    ROUTES.contact,
    ROUTES.privacy,
    ROUTES.terms,
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === ROUTES.home ? 1 : 0.8,
  }));

  try {
    const [events, articles, teamMembers] = await Promise.all([
      prisma.event.findMany({ where: { published: true, deletedAt: null }, select: { slug: true, updatedAt: true } }),
      prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          deletedAt: null,
          publishedAt: { lte: new Date() },
        },
        select: { slug: true, updatedAt: true },
      }),
      prisma.teamMember.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    ]);

    const dynamicPages = [
      ...events.map((e) => ({
        url: `${baseUrl}${ROUTES.event(e.slug)}`,
        lastModified: e.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...articles.map((a) => ({
        url: `${baseUrl}${ROUTES.publication(a.slug)}`,
        lastModified: a.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...teamMembers.map((m) => ({
        url: `${baseUrl}${ROUTES.teamMember(m.slug)}`,
        lastModified: m.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];

    return [...staticPages, ...dynamicPages];
  } catch {
    return staticPages;
  }
}
