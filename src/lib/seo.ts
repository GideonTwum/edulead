import type { Metadata } from "next";
import { env } from "@/lib/env";

export const SEO = {
  siteName: "EduLead Network",
  tagline: "Education for Leadership and Change",
  productionUrl: "https://eduleadnetwork.com",
  defaultTitle: "EduLead Network | Education, Leadership & Youth Development",
  titleTemplate: "%s | EduLead Network",
  defaultDescription:
    "EduLead Network develops young leaders through mentorship, leadership education, policy exposure, career guidance and opportunities for meaningful societal impact.",
  defaultOgImage: "/logo.jpeg",
  locale: "en_US" as const,
  founderName: "Elizabeth Dansoa Osei",
} as const;

export const PAGE_SEO = {
  home: {
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    path: "/",
  },
  about: {
    title: "About EduLead Network | Developing the Next Generation of Leaders",
    description:
      "Discover EduLead Network — our story, vision and mission to develop youth leaders through mentorship, policy exposure and career guidance.",
    path: "/about",
  },
  programmes: {
    title: "Youth Leadership Programmes & Mentorship",
    description:
      "Explore EduLead Network leadership programmes — mentorship, policy training, career guidance and civic leadership development for young people.",
    path: "/programmes",
  },
  opportunities: {
    title: "Scholarships, Fellowships & Youth Opportunities",
    description:
      "Browse scholarships, fellowships, internships and leadership opportunities curated for young people by EduLead Network.",
    path: "/opportunities",
  },
  events: {
    title: "Youth Leadership Events & Policy Dialogues",
    description:
      "Upcoming workshops, policy dialogues, mentorship sessions and leadership events from EduLead Network.",
    path: "/events",
  },
  insights: {
    title: "Leadership, Policy & Career Insights",
    description:
      "Articles on youth leadership, public policy, governance, mentorship and career development from EduLead Network.",
    path: "/insights",
  },
  team: {
    title: "Meet the EduLead Network Team",
    description:
      "Meet the people building EduLead Network — a youth leadership organisation focused on education, mentorship and societal impact.",
    path: "/team",
  },
  join: {
    title: "Join EduLead Network | Mentor, Volunteer, Partner or Participate",
    description:
      "Join EduLead Network as a young person, mentor, volunteer, partner or supporter and help develop the next generation of leaders.",
    path: "/join",
  },
  contact: {
    title: "Contact EduLead Network",
    description:
      "Contact EduLead Network with enquiries about programmes, partnerships, mentorship and youth leadership opportunities.",
    path: "/contact",
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "Read how EduLead Network collects, uses and protects personal information when you use our website and services.",
    path: "/privacy",
  },
  terms: {
    title: "Terms of Use",
    description:
      "Terms and conditions for using the EduLead Network website, programmes and online services.",
    path: "/terms",
  },
} as const;

export function getSiteUrl(): string {
  return env.siteUrl || SEO.productionUrl;
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function truncateDescription(text: string, max = 160): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  const truncated = cleaned.slice(0, max - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? truncated.slice(0, lastSpace) : truncated;
  return `${cut.trim()}…`;
}

export function resolveOgImage(image?: string | null): string {
  if (!image) return absoluteUrl(SEO.defaultOgImage);
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return absoluteUrl(image);
}

function resolvePageTitle(title: string, useAbsolute: boolean): Metadata["title"] {
  if (useAbsolute || title.includes("|")) {
    return { absolute: title };
  }
  return title;
}

export function buildTwitterMeta(title: string, description: string, image?: string | null) {
  return {
    card: "summary_large_image" as const,
    title,
    description: truncateDescription(description),
    images: [resolveOgImage(image)],
  };
}

export function buildOpenGraph(options: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}): NonNullable<Metadata["openGraph"]> {
  const og: NonNullable<Metadata["openGraph"]> = {
    type: options.type ?? "website",
    siteName: SEO.siteName,
    locale: SEO.locale,
    title: options.title,
    description: truncateDescription(options.description),
    url: absoluteUrl(options.path),
    images: [{ url: resolveOgImage(options.image), alt: options.title }],
  };

  if (options.type === "article" && options.publishedTime) {
    return {
      ...og,
      type: "article",
      publishedTime: options.publishedTime,
      modifiedTime: options.modifiedTime,
      authors: options.authors,
    } as NonNullable<Metadata["openGraph"]>;
  }

  return og;
}

export function buildPageMetadata(options: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  useAbsoluteTitle?: boolean;
  noIndex?: boolean;
}): Metadata {
  const description = truncateDescription(options.description);
  const displayTitle =
    options.useAbsoluteTitle || options.title.includes("|")
      ? options.title
      : `${options.title} | ${SEO.siteName}`;

  return {
    title: resolvePageTitle(options.title, Boolean(options.useAbsoluteTitle || options.title.includes("|"))),
    description,
    alternates: { canonical: absoluteUrl(options.path) },
    openGraph: buildOpenGraph({
      title: displayTitle,
      description,
      path: options.path,
      image: options.image,
    }),
    twitter: buildTwitterMeta(displayTitle, description, options.image),
    ...(options.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function buildDynamicMetadata(options: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}): Metadata {
  const description = truncateDescription(options.description);
  const displayTitle = `${options.title} | ${SEO.siteName}`;

  return {
    title: options.title,
    description,
    alternates: { canonical: absoluteUrl(options.path) },
    openGraph: buildOpenGraph({
      title: displayTitle,
      description,
      path: options.path,
      image: options.image,
      type: options.type,
      publishedTime: options.publishedTime,
      modifiedTime: options.modifiedTime,
      authors: options.author ? [options.author] : undefined,
    }),
    twitter: buildTwitterMeta(displayTitle, description, options.image),
  };
}

export function buildBreadcrumbSchemaItems(
  crumbs: { name: string; path?: string }[],
): { name: string; url: string }[] {
  return [
    { name: "Home", url: absoluteUrl("/") },
    ...crumbs.map((crumb) => ({
      name: crumb.name,
      url: crumb.path ? absoluteUrl(crumb.path) : absoluteUrl("/"),
    })),
  ];
}

export function collectSameAsUrls(settings?: {
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
}): string[] {
  if (!settings) return [];
  return [
    settings.facebookUrl,
    settings.twitterUrl,
    settings.instagramUrl,
    settings.linkedinUrl,
    settings.youtubeUrl,
  ].filter((url): url is string => Boolean(url?.trim()));
}
