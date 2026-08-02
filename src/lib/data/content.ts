import prisma from "@/lib/db";
import { ProgrammeStatus, ArticleStatus, EventStatus, OpportunityStatus } from "@prisma/client";

export async function getFeaturedProgrammes(limit = 3) {
  try {
    return await prisma.programme.findMany({
      where: { published: true, deletedAt: null, featured: true },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getPublishedProgrammes() {
  try {
    return await prisma.programme.findMany({
      where: { published: true, deletedAt: null, status: { not: ProgrammeStatus.ARCHIVED } },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getProgrammeBySlug(slug: string) {
  try {
    return await prisma.programme.findFirst({
      where: { slug, published: true, deletedAt: null },
    });
  } catch {
    return null;
  }
}

export async function getActiveOpportunities(filters?: {
  type?: string;
  country?: string;
  locationType?: string;
  search?: string;
  includeExpired?: boolean;
  limit?: number;
}) {
  try {
    const where: Record<string, unknown> = {
      published: true,
      deletedAt: null,
    };

    if (!filters?.includeExpired) {
      where.status = OpportunityStatus.ACTIVE;
    }

    if (filters?.type) where.opportunityType = filters.type;
    if (filters?.country) where.country = filters.country;
    if (filters?.locationType) where.locationType = filters.locationType;
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { organisation: { contains: filters.search, mode: "insensitive" } },
        { excerpt: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return await prisma.opportunity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: filters?.limit,
    });
  } catch {
    return [];
  }
}

export async function getOpportunityBySlug(slug: string) {
  try {
    return await prisma.opportunity.findFirst({
      where: { slug, published: true, deletedAt: null },
    });
  } catch {
    return null;
  }
}

export async function getUpcomingEvents(limit?: number) {
  try {
    return await prisma.event.findMany({
      where: {
        published: true,
        deletedAt: null,
        status: { in: [EventStatus.UPCOMING, EventStatus.ONGOING] },
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getPublishedEvents() {
  try {
    return await prisma.event.findMany({
      where: { published: true, deletedAt: null },
      orderBy: { date: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getEventBySlug(slug: string) {
  try {
    return await prisma.event.findFirst({
      where: { slug, published: true, deletedAt: null },
    });
  } catch {
    return null;
  }
}

export async function getPublishedArticles(filters?: { category?: string; search?: string; limit?: number }) {
  try {
    const where: Record<string, unknown> = {
      status: ArticleStatus.PUBLISHED,
      deletedAt: null,
      publishedAt: { lte: new Date() },
    };

    if (filters?.category) {
      where.categoryLabel = filters.category;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { excerpt: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return await prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: filters?.limit,
      include: { category: true },
    });
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    return await prisma.article.findFirst({
      where: { slug, status: ArticleStatus.PUBLISHED, deletedAt: null },
      include: { category: true },
    });
  } catch {
    return null;
  }
}

export async function getActiveTeamMembers() {
  try {
    return await prisma.teamMember.findMany({
      where: { active: true },
      orderBy: { displayOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getDashboardStats() {
  try {
    const [
      programmes,
      events,
      opportunities,
      articles,
      joinSubmissions,
      messages,
      subscribers,
    ] = await Promise.all([
      prisma.programme.count({ where: { published: true, deletedAt: null } }),
      prisma.event.count({
        where: { published: true, status: EventStatus.UPCOMING, deletedAt: null },
      }),
      prisma.opportunity.count({
        where: { published: true, status: OpportunityStatus.ACTIVE, deletedAt: null },
      }),
      prisma.article.count({ where: { status: ArticleStatus.PUBLISHED, deletedAt: null } }),
      prisma.joinSubmission.count({ where: { status: "NEW" } }),
      prisma.contactMessage.count({ where: { status: "NEW" } }),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
    ]);

    return { programmes, events, opportunities, articles, joinSubmissions, messages, subscribers };
  } catch {
    return {
      programmes: 0,
      events: 0,
      opportunities: 0,
      articles: 0,
      joinSubmissions: 0,
      messages: 0,
      subscribers: 0,
    };
  }
}
