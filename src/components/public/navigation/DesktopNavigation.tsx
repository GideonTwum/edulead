"use client";

import {
  PUBLIC_CONTACT_LINK,
  PUBLIC_NAV_DROPDOWNS,
  PUBLIC_PRIMARY_LINKS,
  isContactLinkActive,
  isPrimaryLinkActive,
} from "@/lib/navigation/public-nav";
import { NavLink } from "./NavLink";
import { NavigationDropdown } from "./NavigationDropdown";

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
        {PUBLIC_PRIMARY_LINKS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            isActive={isPrimaryLinkActive(pathname, item.href)}
          />
        ))}
        {PUBLIC_NAV_DROPDOWNS.map((menu) => (
          <NavigationDropdown key={menu.id} menu={menu} pathname={pathname} />
        ))}
        <NavLink
          href={PUBLIC_CONTACT_LINK.href}
          label={PUBLIC_CONTACT_LINK.label}
          isActive={isContactLinkActive(pathname)}
        />
      </div>
    </nav>
  );
}
