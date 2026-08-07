import prisma from "@/lib/db";
import { PageKey } from "@prisma/client";

const defaultSettings = {
  organisationName: "EduLead Network",
  tagline: "Education for Leadership and Change",
  logoUrl: "/logo.jpeg",
  faviconUrl: null as string | null,
  generalEmail: null as string | null,
  phone: null as string | null,
  whatsapp: null as string | null,
  address: null as string | null,
  facebookUrl: null as string | null,
  twitterUrl: null as string | null,
  instagramUrl: null as string | null,
  linkedinUrl: null as string | null,
  youtubeUrl: null as string | null,
  footerText: null as string | null,
  googleAnalyticsId: null as string | null,
  defaultSeoTitle: "EduLead Network | Education, Leadership & Youth Development",
  defaultSeoDescription:
    "EduLead Network develops young leaders through mentorship, leadership education, policy exposure, career guidance and opportunities for meaningful societal impact.",
};

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSetting.findFirst();
    return settings ?? defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function getAnnouncement() {
  try {
    return await prisma.pageContent.findFirst({
      where: { pageKey: PageKey.ANNOUNCEMENT, published: true, visible: true },
    });
  } catch {
    return null;
  }
}

export async function getPageSections(pageKey: PageKey) {
  try {
    return await prisma.pageContent.findMany({
      where: { pageKey, published: true, visible: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export function getSection(sections: Awaited<ReturnType<typeof getPageSections>>, key: string) {
  return sections.find((s) => s.sectionKey === key);
}
