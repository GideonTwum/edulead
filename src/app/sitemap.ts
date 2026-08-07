import type { MetadataRoute } from "next";
import prisma from "@/lib/db";
import { env } from "@/lib/env";
import { ROUTES } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.siteUrl;

  const staticPages = [
    ROUTES.home,
    ROUTES.about,
    ROUTES.programmes,
    ROUTES.opportunities,
    ROUTES.events,
    ROUTES.insights,
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
    const [programmes, opportunities, events, articles] = await Promise.all([
      prisma.programme.findMany({ where: { published: true, deletedAt: null }, select: { slug: true, updatedAt: true } }),
      prisma.opportunity.findMany({ where: { published: true, deletedAt: null }, select: { slug: true, updatedAt: true } }),
      prisma.event.findMany({ where: { published: true, deletedAt: null }, select: { slug: true, updatedAt: true } }),
      prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          deletedAt: null,
          publishedAt: { lte: new Date() },
        },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const dynamicPages = [
      ...programmes.map((p) => ({
        url: `${baseUrl}${ROUTES.programme(p.slug)}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...opportunities.map((o) => ({
        url: `${baseUrl}${ROUTES.opportunity(o.slug)}`,
        lastModified: o.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
      ...events.map((e) => ({
        url: `${baseUrl}${ROUTES.event(e.slug)}`,
        lastModified: e.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...articles.map((a) => ({
        url: `${baseUrl}${ROUTES.insight(a.slug)}`,
        lastModified: a.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];

    return [...staticPages, ...dynamicPages];
  } catch {
    return staticPages;
  }
}
