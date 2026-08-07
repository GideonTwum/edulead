/**
 * Public-facing illustrative photography placeholders.
 * Replace SVG paths with final editorial JPG/WebP assets in the same folders.
 * All photography is illustrative — not real individuals unless sourced and approved.
 */

export interface PublicImageRef {
  src: string;
  alt: string;
}

const hero = {
  main: {
    src: "/images/hero/main.svg",
    alt: "Illustrative photo placeholder — young Black students collaborating on campus",
  },
  secondary: {
    src: "/images/hero/secondary.svg",
    alt: "Illustrative photo placeholder — mentor guiding a young professional",
  },
  mentorshipCard: {
    src: "/images/hero/mentorship.svg",
    alt: "Illustrative photo placeholder — mentorship conversation",
  },
  policyCard: {
    src: "/images/hero/policy.svg",
    alt: "Illustrative photo placeholder — youth policy discussion",
  },
} as const;

const students = {
  undergraduate: {
    src: "/images/students/undergraduate.svg",
    alt: "Illustrative photo placeholder — university student in leadership discussion",
  },
  graduate: {
    src: "/images/students/graduate.svg",
    alt: "Illustrative photo placeholder — graduate student researching policy",
  },
  youngProfessional: {
    src: "/images/students/young-professional.svg",
    alt: "Illustrative photo placeholder — young professional at a workshop",
  },
  civicLeader: {
    src: "/images/students/civic-leader.svg",
    alt: "Illustrative photo placeholder — youth leader speaking in a community setting",
  },
  firstGen: {
    src: "/images/students/first-generation.svg",
    alt: "Illustrative photo placeholder — first-generation student studying with peers",
  },
  publicService: {
    src: "/images/students/public-service.svg",
    alt: "Illustrative photo placeholder — young person exploring a public service pathway",
  },
} as const;

const programmes = {
  mentorship: {
    src: "/images/programmes/mentorship.svg",
    alt: "Illustrative photo placeholder — mentorship and coaching session",
  },
  policy: {
    src: "/images/programmes/policy.svg",
    alt: "Illustrative photo placeholder — youth policy dialogue",
  },
  career: {
    src: "/images/programmes/career.svg",
    alt: "Illustrative photo placeholder — career development workshop",
  },
  dialogue: {
    src: "/images/programmes/dialogue.svg",
    alt: "Illustrative photo placeholder — group discussion on governance",
  },
  civic: {
    src: "/images/programmes/civic.svg",
    alt: "Illustrative photo placeholder — civic leadership training",
  },
  default: {
    src: "/images/programmes/default.svg",
    alt: "Illustrative photo placeholder — leadership development programme",
  },
} as const;

const resources = {
  collaboration: {
    src: "/images/resources/collaboration.svg",
    alt: "Illustrative photo placeholder — students collaborating on a project",
  },
  events: {
    src: "/images/resources/events.svg",
    alt: "Illustrative photo placeholder — leadership workshop in session",
  },
  opportunities: {
    src: "/images/resources/opportunities.svg",
    alt: "Illustrative photo placeholder — young professional reviewing opportunities",
  },
  insights: {
    src: "/images/resources/insights.svg",
    alt: "Illustrative photo placeholder — reading and learning together",
  },
  team: {
    src: "/images/resources/team.svg",
    alt: "Illustrative photo placeholder — diverse team in conversation",
  },
} as const;

const founder = {
  introducingArtwork: {
    src: "/images/founder/introducing-edulead-network.jpg",
    alt: "EduLead Network introduction artwork featuring founder Elizabeth Dansoa Osei",
  },
  alt: "EduLead Network introduction artwork featuring founder Elizabeth Dansoa Osei",
} as const;

const sections = {
  visionMission: {
    src: "/images/professionals/vision.svg",
    alt: "Illustrative photo placeholder — young leaders in thoughtful conversation",
  },
  join: {
    src: "/images/sections/join-the-movement.jpg",
    alt: "",
  },
  newsletter: {
    src: "/images/professionals/newsletter.svg",
    alt: "Illustrative photo placeholder — students connecting through a community network",
  },
  aboutStory: {
    src: "/images/professionals/story.svg",
    alt: "Illustrative photo placeholder — emerging organisation building community",
  },
  aboutApproach: {
    src: "/images/professionals/approach.svg",
    alt: "Illustrative photo placeholder — hybrid learning and dialogue",
  },
  teamEmpty: {
    src: "/images/placeholders/team-coming-soon.svg",
    alt: "Illustrative photo placeholder — leadership team introduction coming soon",
  },
} as const;

export const PUBLIC_IMAGES = {
  hero,
  students,
  programmes,
  resources,
  founder,
  sections,
} as const;

/** Maps TARGET_AUDIENCES index to illustrative photography */
export const AUDIENCE_IMAGES: PublicImageRef[] = [
  students.undergraduate,
  students.graduate,
  students.youngProfessional,
  students.civicLeader,
  students.firstGen,
  students.publicService,
];

const PROGRAMME_CATEGORY_IMAGES: Record<string, PublicImageRef> = {
  MENTORSHIP_COACHING: programmes.mentorship,
  POLICY_LEADERSHIP_TRAINING: programmes.policy,
  CAREER_DEVELOPMENT: programmes.career,
  YOUTH_POLICY_DIALOGUE: programmes.dialogue,
  CIVIC_LEADERSHIP: programmes.civic,
  COMMUNICATION_RESEARCH: programmes.default,
};

export function getProgrammePlaceholder(category?: string | null): PublicImageRef {
  if (category && category in PROGRAMME_CATEGORY_IMAGES) {
    return PROGRAMME_CATEGORY_IMAGES[category];
  }
  return programmes.default;
}

export function resolveImageSrc(
  primary?: string | null,
  fallback?: PublicImageRef,
): { src: string; alt: string } {
  if (primary) {
    return { src: primary, alt: fallback?.alt ?? "EduLead Network" };
  }
  return fallback ?? programmes.default;
}
