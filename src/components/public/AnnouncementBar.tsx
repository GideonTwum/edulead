"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AnnouncementBarProps {
  text: string;
  link?: string | null;
}

export function AnnouncementBar({ text, link }: AnnouncementBarProps) {
  const content = (
    <>
      <span>{text}</span>
      {link ? <ArrowRight aria-hidden className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" /> : null}
    </>
  );

  return (
    <div className="border-b border-brand-navy-dark/20 bg-brand-navy text-white">
      <div className="nav-header-container flex h-10 items-center justify-center px-4 text-center text-sm">
        {link ? (
          <Link
            href={link}
            className="group inline-flex max-w-full items-center gap-2 font-medium transition-colors hover:text-brand-green"
          >
            {content}
          </Link>
        ) : (
          <span className="inline-flex max-w-full items-center gap-2 font-medium">{content}</span>
        )}
      </div>
    </div>
  );
}
