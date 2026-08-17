import Link from "next/link";
import { ROUTES } from "@/lib/constants";

interface PublicationRelatedLinksProps {
  category?: string | null;
}

export function PublicationRelatedLinks({ category }: PublicationRelatedLinksProps) {
  const normalized = category?.toLowerCase() ?? "";
  const links: { href: string; label: string }[] = [];

  if (normalized.includes("leadership") || normalized.includes("mentorship")) {
    links.push({ href: ROUTES.events, label: "Explore youth leadership events" });
  }

  if (normalized.includes("policy") || normalized.includes("governance")) {
    links.push({ href: ROUTES.events, label: "View policy dialogues and events" });
  }

  links.push({ href: ROUTES.join, label: "Join the EduLead Network movement" });

  const unique = links.filter(
    (link, index, arr) => arr.findIndex((item) => item.href === link.href) === index,
  );

  return (
    <nav aria-label="Related pages" className="mt-10 border-t border-brand-border pt-8">
      <h2 className="font-display text-lg font-bold text-brand-navy">Continue exploring</h2>
      <ul className="mt-4 space-y-2">
        {unique.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-brand-navy underline-offset-4 hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
