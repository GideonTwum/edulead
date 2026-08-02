"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import {
  PROGRAMMES_DROPDOWN,
  PUBLIC_CONTACT_LINK,
  PUBLIC_PRIMARY_LINKS,
  RESOURCES_DROPDOWN,
  isContactLinkActive,
  isPrimaryLinkActive,
} from "@/lib/navigation/public-nav";
import type { PublicNavDropdown } from "@/lib/navigation/public-nav";
import { HeaderLogo } from "./HeaderLogo";
import { JoinMovementButton } from "./JoinMovementButton";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
  logoUrl: string;
}

function MobileAccordionSection({
  menu,
  pathname,
  onNavigate,
}: {
  menu: PublicNavDropdown;
  pathname: string;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(menu.isActive(pathname));
  const sectionId = `mobile-${menu.id}`;

  return (
    <div className="border-b border-brand-border">
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={sectionId}
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center justify-between px-4 py-4 text-left text-base font-semibold text-brand-navy"
      >
        {menu.label}
        <ChevronDown
          aria-hidden
          className={cn("h-5 w-5 transition-transform", expanded && "rotate-180")}
        />
      </button>
      {expanded ? (
        <ul id={sectionId} className="space-y-1 px-3 pb-3">
          {menu.items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-3 text-sm transition-colors",
                    active
                      ? "bg-brand-navy text-white"
                      : "text-brand-text hover:bg-brand-off-white",
                  )}
                >
                  <span className="block font-medium">{item.label}</span>
                  {item.description ? (
                    <span
                      className={cn(
                        "mt-1 block text-xs leading-relaxed",
                        active ? "text-white/80" : "text-brand-grey",
                      )}
                    >
                      {item.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function MobileNavigation({
  open,
  onClose,
  pathname,
  logoUrl,
}: MobileNavigationProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { prefersReducedMotion } = useMotionConfig();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-[60] bg-brand-navy/50 backdrop-blur-sm xl:hidden"
            aria-label="Close menu"
            onClick={onClose}
          />
          <motion.div
            id="mobile-navigation-panel"
            ref={panelRef}
            initial={prefersReducedMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={prefersReducedMotion ? undefined : { x: "100%" }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: "spring", damping: 32, stiffness: 320 }
            }
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-white shadow-brand-lg xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b border-brand-border px-4 py-4">
              <HeaderLogo logoUrl={logoUrl} compact onNavigate={onClose} />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-brand-navy"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto overscroll-contain" aria-label="Mobile navigation">
              <ul className="divide-y divide-brand-border">
                {PUBLIC_PRIMARY_LINKS.map((item) => {
                  const active = isPrimaryLinkActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "block px-4 py-4 text-base font-medium transition-colors",
                          active
                            ? "bg-brand-navy text-white"
                            : "text-brand-text hover:bg-brand-off-white",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <MobileAccordionSection menu={PROGRAMMES_DROPDOWN} pathname={pathname} onNavigate={onClose} />
              <MobileAccordionSection menu={RESOURCES_DROPDOWN} pathname={pathname} onNavigate={onClose} />

              <Link
                href={PUBLIC_CONTACT_LINK.href}
                onClick={onClose}
                aria-current={isContactLinkActive(pathname) ? "page" : undefined}
                className={cn(
                  "block border-b border-brand-border px-4 py-4 text-base font-medium transition-colors",
                  isContactLinkActive(pathname)
                    ? "bg-brand-navy text-white"
                    : "text-brand-text hover:bg-brand-off-white",
                )}
              >
                {PUBLIC_CONTACT_LINK.label}
              </Link>
            </nav>

            <div className="border-t border-brand-border p-4">
              <JoinMovementButton className="w-full py-3.5 text-base" onNavigate={onClose} />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
