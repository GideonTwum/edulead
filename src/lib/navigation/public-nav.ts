import { ROUTES } from "@/lib/constants";

export const FEATURED_PROGRAMME_SLUGS = {
  mentorship: "youth-leadership-mentorship-programme",
  policyDialogue: "youth-policy-dialogue-series",
} as const;

export interface PublicNavLink {
  label: string;
  href: string;
  description?: string;
}

export interface PublicNavDropdown {
  id: string;
  label: string;
  items: PublicNavLink[];
  isActive: (pathname: string) => boolean;
}

export const PUBLIC_PRIMARY_LINKS: PublicNavLink[] = [
  { label: "Home", href: ROUTES.home },
  { label: "About", href: ROUTES.about },
];

export const PROGRAMMES_DROPDOWN: PublicNavDropdown = {
  id: "programmes",
  label: "Programmes",
  items: [
    {
      label: "All Programmes",
      href: ROUTES.programmes,
      description: "Explore EduLead’s emerging programme areas",
    },
    {
      label: "Mentorship Programme",
      href: ROUTES.programme(FEATURED_PROGRAMME_SLUGS.mentorship),
      description: "Mentorship and leadership development",
    },
    {
      label: "Policy Dialogue Series",
      href: ROUTES.programme(FEATURED_PROGRAMME_SLUGS.policyDialogue),
      description: "Youth conversations on policy and governance",
    },
    {
      label: "Express Interest",
      href: ROUTES.join,
      description: "Tell EduLead how you would like to participate",
    },
  ],
  isActive: (pathname) =>
    pathname === ROUTES.programmes || pathname.startsWith(`${ROUTES.programmes}/`),
};

export const RESOURCES_DROPDOWN: PublicNavDropdown = {
  id: "resources",
  label: "Resources",
  items: [
    {
      label: "Opportunities",
      href: ROUTES.opportunities,
      description: "Scholarships, fellowships, internships and more",
    },
    {
      label: "Events",
      href: ROUTES.events,
      description: "Workshops, dialogues and leadership sessions",
    },
    {
      label: "Insights",
      href: ROUTES.insights,
      description: "Articles and practical resources",
    },
    {
      label: "Team",
      href: ROUTES.team,
      description: "Meet the people building EduLead",
    },
  ],
  isActive: (pathname) =>
    [ROUTES.opportunities, ROUTES.events, ROUTES.insights, ROUTES.team].some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    ),
};

export const PUBLIC_CONTACT_LINK: PublicNavLink = {
  label: "Contact",
  href: ROUTES.contact,
};

export const JOIN_MOVEMENT_CTA = {
  label: "Join the Movement",
  href: ROUTES.join,
} as const;

export const PUBLIC_NAV_DROPDOWNS = [PROGRAMMES_DROPDOWN, RESOURCES_DROPDOWN] as const;

export function isPrimaryLinkActive(pathname: string, href: string): boolean {
  if (href === ROUTES.home) {
    return pathname === ROUTES.home;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isContactLinkActive(pathname: string): boolean {
  return pathname === ROUTES.contact;
}
