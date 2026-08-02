import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-brand-grey">
        <li>
          <Link
            href={ROUTES.home}
            className="inline-flex items-center gap-1 transition-colors hover:text-brand-navy"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-brand-border" aria-hidden="true" />
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="transition-colors hover:text-brand-navy">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-brand-navy" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
