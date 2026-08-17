import { ROUTES } from "@/lib/constants";

export interface PublicNavLink {
  label: string;
  href: string;
}

export const PUBLIC_NAV_LINKS: PublicNavLink[] = [
  { label: "Home", href: ROUTES.home },
  { label: "About", href: ROUTES.about },
  { label: "Events & Media", href: ROUTES.events },
  { label: "Publications", href: ROUTES.publications },
  { label: "Team", href: ROUTES.team },
  { label: "Contact", href: ROUTES.contact },
];

export const JOIN_MOVEMENT_CTA = {
  label: "Join the Movement",
  href: ROUTES.join,
} as const;

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === ROUTES.home) {
    return pathname === ROUTES.home;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
