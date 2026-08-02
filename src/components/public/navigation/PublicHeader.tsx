"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { AnnouncementBar } from "@/components/public/AnnouncementBar";
import { DesktopNavigation } from "@/components/public/navigation/DesktopNavigation";
import { HeaderLogo } from "@/components/public/navigation/HeaderLogo";
import { JoinMovementButton } from "@/components/public/navigation/JoinMovementButton";
import { MobileNavigation } from "@/components/public/navigation/MobileNavigation";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";

interface PublicHeaderProps {
  settings?: {
    organisationName?: string;
    tagline?: string | null;
    logoUrl?: string | null;
  } | null;
  announcement?: {
    text: string;
    link?: string | null;
  } | null;
}

export function PublicHeader({ settings, announcement }: PublicHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { prefersReducedMotion } = useMotionConfig();

  const logoUrl = settings?.logoUrl ?? "/logo.jpeg";
  const showAnnouncement = Boolean(announcement?.text);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const headerHeightClass = scrolled ? "h-[76px] xl:h-20" : "h-[88px] xl:h-24";
  const spacerHeightClass = showAnnouncement
    ? scrolled
      ? "h-[116px] xl:h-[120px]"
      : "h-[128px] xl:h-[136px]"
    : scrolled
      ? "h-[76px] xl:h-20"
      : "h-[88px] xl:h-24";

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.92)",
          boxShadow: scrolled ? "0 8px 32px rgba(21,26,99,0.08)" : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: "easeOut" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 overflow-visible backdrop-blur-md",
          scrolled ? "border-b border-brand-border" : "border-b border-transparent",
        )}
      >
        {showAnnouncement && announcement ? (
          <AnnouncementBar text={announcement.text} link={announcement.link} />
        ) : null}

        <div
          className={cn(
            "nav-header-container grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 xl:grid-cols-[1fr_auto_1fr] xl:gap-10",
            headerHeightClass,
          )}
        >
          <HeaderLogo logoUrl={logoUrl} compact={scrolled} className="justify-self-start xl:pr-2" />

          <DesktopNavigation pathname={pathname} />

          <div className="flex items-center justify-end gap-3 justify-self-end xl:pl-2">
            <JoinMovementButton className="hidden xl:inline-flex" />
            <button
              type="button"
              className="rounded-lg p-2.5 text-brand-navy xl:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-panel"
            >
              <Menu className="h-6 w-6" aria-hidden />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileNavigation
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
        logoUrl={logoUrl}
      />

      <div className={spacerHeightClass} aria-hidden="true" />
    </>
  );
}
