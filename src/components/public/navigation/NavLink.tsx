"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onNavigate?: () => void;
  className?: string;
  showUnderline?: boolean;
}

export function NavLink({
  href,
  label,
  isActive,
  onNavigate,
  className,
  showUnderline = true,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-dark",
        isActive ? "text-brand-navy" : "text-brand-grey hover:text-brand-navy",
        className,
      )}
    >
      {label}
      {showUnderline && isActive ? (
        <motion.span
          layoutId="public-nav-underline"
          className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-green"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      ) : null}
    </Link>
  );
}
