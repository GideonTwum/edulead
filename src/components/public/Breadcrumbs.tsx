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
  light?: boolean;
}

export function Breadcrumbs({ items, className, light = false }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
      <ol className={cn("flex flex-wrap items-center gap-1 text-sm", light ? "text-white/70" : "text-brand-grey")}>
        <li>
          <Link
            href={ROUTES.home}
            className={cn(
              "inline-flex items-center gap-1 transition-colors",
              light ? "hover:text-white" : "hover:text-brand-navy",
            )}
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className={cn("h-3.5 w-3.5", light ? "text-white/30" : "text-brand-border")} aria-hidden="true" />
            {item.href && i < items.length - 1 ? (
              <Link
                href={item.href}
                className={cn("transition-colors", light ? "hover:text-white" : "hover:text-brand-navy")}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn("font-medium", light ? "text-white" : "text-brand-navy")}
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
