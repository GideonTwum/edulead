"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { PublicNavDropdown } from "@/lib/navigation/public-nav";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";

interface NavigationDropdownProps {
  menu: PublicNavDropdown;
  pathname: string;
  onNavigate?: () => void;
}

export function NavigationDropdown({ menu, pathname, onNavigate }: NavigationDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const { prefersReducedMotion } = useMotionConfig();
  const isActive = menu.isActive(pathname);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        id={`${menuId}-trigger`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${menuId}-menu`}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-dark",
          isActive || open ? "text-brand-navy" : "text-brand-grey hover:text-brand-navy",
        )}
      >
        {menu.label}
        <ChevronDown
          aria-hidden
          className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
        />
        {isActive ? (
          <motion.span
            layoutId="public-nav-underline"
            className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-green"
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 380, damping: 32 }
            }
          />
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={`${menuId}-menu`}
            role="menu"
            aria-labelledby={`${menuId}-trigger`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            className="absolute left-0 top-[calc(100%+0.5rem)] z-50 min-w-[18rem] overflow-hidden rounded-brand-lg border border-brand-border bg-white p-2 shadow-brand-lg"
          >
            <ul className="space-y-1">
              {menu.items.map((item) => {
                const itemActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <li key={item.href} role="none">
                    <Link
                      href={item.href}
                      role="menuitem"
                      onClick={() => {
                        close();
                        onNavigate?.();
                      }}
                      className={cn(
                        "block rounded-lg px-3 py-3 transition-colors",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-dark",
                        itemActive
                          ? "bg-brand-off-white text-brand-navy"
                          : "text-brand-text hover:bg-brand-off-white hover:text-brand-navy",
                      )}
                    >
                      <span className="block text-sm font-semibold">{item.label}</span>
                      {item.description ? (
                        <span className="mt-1 block text-xs leading-relaxed text-brand-grey">
                          {item.description}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
