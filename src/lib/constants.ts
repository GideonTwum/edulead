export const ROUTES = {
  home: "/",
  about: "/about",
  programmes: "/programmes",
  programme: (slug: string) => `/programmes/${slug}`,
  opportunities: "/opportunities",
  opportunity: (slug: string) => `/opportunities/${slug}`,
  events: "/events",
  event: (slug: string) => `/events/${slug}`,
  insights: "/insights",
  insight: (slug: string) => `/insights/${slug}`,
  publications: "/publications",
  publication: (slug: string) => `/publications/${slug}`,
  team: "/team",
  teamMember: (slug: string) => `/team/${slug}`,
  join: "/join",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  admin: {
    login: "/admin/login",
    dashboard: "/admin/dashboard",
    pages: "/admin/pages",
    programmes: "/admin/programmes",
    opportunities: "/admin/opportunities",
    events: "/admin/events",
    articles: "/admin/articles",
    team: "/admin/team",
    submissions: "/admin/submissions",
    messages: "/admin/messages",
    newsletter: "/admin/newsletter",
    media: "/admin/media",
    settings: "/admin/settings",
  },
} as const;

export const NAV_ITEMS = [
  { label: "Home", href: ROUTES.home },
  { label: "About", href: ROUTES.about },
  { label: "Events & Media", href: ROUTES.events },
  { label: "Publications", href: ROUTES.publications },
  { label: "Team", href: ROUTES.team },
  { label: "Contact", href: ROUTES.contact },
] as const;

export const FOCUS_AREAS = [
  {
    title: "Mentorship and Coaching",
    description:
      "Structured one-on-one and group mentorship to guide young people through career transitions and leadership development.",
    icon: "users",
  },
  {
    title: "Policy and Leadership Training",
    description:
      "Workshops and seminars on policy analysis, governance structures, and civic leadership fundamentals.",
    icon: "landmark",
  },
  {
    title: "Career and Opportunity Guidance",
    description:
      "Support navigating scholarships, fellowships, internships, and pathways into public service and impact careers.",
    icon: "compass",
  },
  {
    title: "Youth Policy Dialogue",
    description:
      "Conversations with policymakers, academics, and practitioners on education, governance, and youth inclusion.",
    icon: "message-circle",
  },
  {
    title: "Civic and Governance Engagement",
    description:
      "Building understanding of governance systems and strengthening youth participation in civic processes.",
    icon: "scale",
  },
  {
    title: "Communication and Critical Thinking",
    description:
      "Developing skills in policy writing, research, public speaking, and analytical thinking.",
    icon: "pen-line",
  },
] as const;

export const CORE_VALUES = [
  { title: "Leadership", description: "Empowering young people to lead with purpose and conviction." },
  { title: "Integrity", description: "Upholding ethical standards in all our engagements and relationships." },
  { title: "Service", description: "Committing to the betterment of communities and society at large." },
  { title: "Excellence", description: "Pursuing the highest standards in mentorship, training, and support." },
  { title: "Inclusion", description: "Ensuring equitable access for diverse young people across backgrounds." },
  { title: "Civic Responsibility", description: "Fostering active participation in governance and public life." },
  { title: "Lifelong Learning", description: "Encouraging continuous growth beyond formal education." },
] as const;

export const TARGET_AUDIENCES = [
  "Senior high school students",
  "University students",
  "Graduates",
  "Young professionals",
  "First-generation opportunity seekers",
  "Young people interested in governance, policy, leadership, or public service",
] as const;

export const JOIN_PATHWAYS = [
  {
    type: "YOUNG_PERSON" as const,
    title: "Join as a Young Person",
    description: "Access mentorship, training, and leadership development opportunities.",
    href: `${ROUTES.join}?type=young-person`,
  },
  {
    type: "MENTOR" as const,
    title: "Become a Mentor",
    description: "Share your expertise and guide the next generation of leaders.",
    href: `${ROUTES.join}?type=mentor`,
  },
  {
    type: "VOLUNTEER" as const,
    title: "Volunteer With Us",
    description: "Contribute your skills and time to our growing community.",
    href: `${ROUTES.join}?type=volunteer`,
  },
  {
    type: "PARTNER" as const,
    title: "Partner With EduLead",
    description: "Collaborate with us to expand leadership opportunities for youth.",
    href: `${ROUTES.join}?type=partner`,
  },
  {
    type: "SUPPORTER" as const,
    title: "Support the Mission",
    description: "Help us build the infrastructure for youth leadership development.",
    href: `${ROUTES.join}?type=supporter`,
  },
] as const;

export const ENQUIRY_TYPES = [
  "General Enquiry",
  "Programme Enquiry",
  "Opportunity Enquiry",
  "Event Enquiry",
  "Partnership",
  "Media",
  "Volunteer",
  "Other",
] as const;

export const EDUCATION_LEVELS = [
  "Senior High School",
  "Undergraduate",
  "Graduate",
  "Postgraduate",
  "Young Professional",
  "Other",
] as const;

export const INTEREST_AREAS = [
  "Mentorship",
  "Policy Training",
  "Career Guidance",
  "Youth Policy Dialogue",
  "Civic Engagement",
  "Communication Skills",
  "Scholarships & Fellowships",
  "Public Service Careers",
] as const;

export const SUPPORT_TYPES = [
  "Financial Support",
  "In-kind Donation",
  "Pro Bono Services",
  "Venue or Resources",
  "Other",
] as const;

export const PUBLIC_MEDIA_FOLDERS = [
  "branding",
  "team",
  "programmes",
  "events",
  "opportunities",
  "articles",
  "resources",
  "general",
] as const;

export const PRIVATE_MEDIA_FOLDERS = ["partner-proposals", "join-attachments"] as const;

export const STORAGE_FOLDERS = [...PUBLIC_MEDIA_FOLDERS] as const;

export const FILE_LIMITS = {
  image: 10 * 1024 * 1024,
  document: 10 * 1024 * 1024,
} as const;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;
