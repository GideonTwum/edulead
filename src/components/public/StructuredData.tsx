import { env } from "@/lib/env";

interface OrganizationSchemaProps {
  name?: string;
  description?: string;
  logo?: string;
  url?: string;
}

export function OrganizationSchema({
  name = "EduLead Network",
  description = "Bridging the gap between education and leadership for young people.",
  logo = "/logo.jpeg",
  url = env.siteUrl,
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    description,
    url,
    logo: `${url}${logo}`,
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  image,
  datePublished,
  author,
  url,
}: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  author: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image ? [image] : undefined,
    datePublished,
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "Organization",
      name: "EduLead Network",
      logo: { "@type": "ImageObject", url: `${env.siteUrl}/logo.jpeg` },
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

export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  url,
  image,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url: string;
  image?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    endDate,
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    location: location
      ? { "@type": "Place", name: location }
      : { "@type": "VirtualLocation", url },
    image: image ? [image] : undefined,
    organizer: { "@type": "Organization", name: "EduLead Network", url: env.siteUrl },
    url,
  };

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
