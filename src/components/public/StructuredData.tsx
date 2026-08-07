import {
  SEO,
  absoluteUrl,
  buildBreadcrumbSchemaItems,
  collectSameAsUrls,
  resolveOgImage,
  truncateDescription,
} from "@/lib/seo";

interface OrganizationSchemaProps {
  name?: string;
  description?: string;
  logo?: string;
  url?: string;
  email?: string | null;
  sameAs?: string[];
}

export function OrganizationSchema({
  name = SEO.siteName,
  description = SEO.defaultDescription,
  logo = SEO.defaultOgImage,
  url = absoluteUrl("/"),
  email,
  sameAs = [],
}: OrganizationSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    description: truncateDescription(description, 300),
    url,
    logo: resolveOgImage(logo),
    founder: {
      "@type": "Person",
      name: SEO.founderName,
    },
  };

  if (email) schema.email = email;
  if (sameAs.length > 0) schema.sameAs = sameAs;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchemaFromSettings(settings: {
  organisationName?: string | null;
  tagline?: string | null;
  logoUrl?: string | null;
  generalEmail?: string | null;
  defaultSeoDescription?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
}) {
  return (
    <OrganizationSchema
      name={settings.organisationName ?? SEO.siteName}
      description={settings.defaultSeoDescription ?? SEO.defaultDescription}
      logo={settings.logoUrl ?? SEO.defaultOgImage}
      email={settings.generalEmail}
      sameAs={collectSameAsUrls(settings)}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  url,
}: {
  title: string;
  description: string;
  image?: string | null;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: truncateDescription(description, 300),
    image: image ? [resolveOgImage(image)] : [resolveOgImage(SEO.defaultOgImage)],
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: { "@type": "Organization", name: author },
    publisher: {
      "@type": "Organization",
      name: SEO.siteName,
      logo: { "@type": "ImageObject", url: resolveOgImage(SEO.defaultOgImage) },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

const EVENT_STATUS_MAP: Record<string, string> = {
  UPCOMING: "https://schema.org/EventScheduled",
  ONGOING: "https://schema.org/EventScheduled",
  COMPLETED: "https://schema.org/EventPast",
  CANCELLED: "https://schema.org/EventCancelled",
};

export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  venue,
  onlineLink,
  url,
  image,
  status,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string | null;
  venue?: string | null;
  onlineLink?: string | null;
  url: string;
  image?: string | null;
  status?: string;
}) {
  const hasVenue = Boolean(venue?.trim());
  const hasOnline = Boolean(onlineLink?.trim());

  let eventAttendanceMode = "https://schema.org/OfflineEventAttendanceMode";
  if (hasOnline && !hasVenue) {
    eventAttendanceMode = "https://schema.org/OnlineEventAttendanceMode";
  } else if (hasOnline && hasVenue) {
    eventAttendanceMode = "https://schema.org/MixedEventAttendanceMode";
  }

  let locationSchema: Record<string, unknown>;
  if (hasVenue) {
    locationSchema = { "@type": "Place", name: venue };
  } else if (hasOnline) {
    locationSchema = { "@type": "VirtualLocation", url: onlineLink };
  } else if (location) {
    locationSchema = { "@type": "Place", name: location };
  } else {
    locationSchema = { "@type": "VirtualLocation", url };
  }

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description: truncateDescription(description, 300),
    startDate,
    eventAttendanceMode,
    location: locationSchema,
    organizer: { "@type": "Organization", name: SEO.siteName, url: absoluteUrl("/") },
    url,
    image: image ? [resolveOgImage(image)] : [resolveOgImage(SEO.defaultOgImage)],
  };

  if (endDate) schema.endDate = endDate;
  if (status && EVENT_STATUS_MAP[status]) {
    schema.eventStatus = EVENT_STATUS_MAP[status];
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchemaFromPaths({
  crumbs,
}: {
  crumbs: { name: string; path?: string }[];
}) {
  return <BreadcrumbSchema items={buildBreadcrumbSchemaItems(crumbs)} />;
}
