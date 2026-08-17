"use client";

import {
  JOIN_MOVEMENT_CTA,
  PUBLIC_NAV_LINKS,
  isNavLinkActive,
} from "@/lib/navigation/public-nav";
import { NavLink } from "./NavLink";

interface DesktopNavigationProps {
  pathname: string;
}

export function DesktopNavigation({ pathname }: DesktopNavigationProps) {
  return (
    <nav
      className="hidden min-w-0 items-center justify-center overflow-visible xl:flex"
      aria-label="Main navigation"
    >
      <div className="flex min-w-0 items-center gap-1 2xl:gap-2">
        {PUBLIC_NAV_LINKS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            isActive={isNavLinkActive(pathname, item.href)}
          />
        ))}
      </div>
    </nav>
  );
}

export { JOIN_MOVEMENT_CTA };
