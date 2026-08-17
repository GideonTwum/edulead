"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  JOIN_MOVEMENT_CTA,
  PUBLIC_NAV_LINKS,
  isNavLinkActive,
} from "@/lib/navigation/public-nav";
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

export function MobileNavigation({
  open,
  onClose,
  pathname,
  logoUrl,
}: MobileNavigationProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { prefersReducedMotion } = useMotionConfig();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
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
                {PUBLIC_NAV_LINKS.map((item) => {
                  const active = isNavLinkActive(pathname, item.href);
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

export { JOIN_MOVEMENT_CTA };
