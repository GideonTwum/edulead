import {
  GraduationCap,
  Users,
  Briefcase,
  Globe,
  Heart,
  Mic,
  type LucideIcon,
} from "lucide-react";

export interface AudienceGroup {
  id: string;
  title: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  imagePosition: string;
}

export const AUDIENCE_GROUPS: AudienceGroup[] = [
  {
    id: "senior-high-school-students",
    title: "Senior high school students",
    icon: GraduationCap,
    image: "/images/audiences/senior-high-school-students.jpg",
    imageAlt: "Students participating in an educational engagement session",
    imagePosition: "center 40%",
  },
  {
    id: "university-students",
    title: "University students",
    icon: Users,
    image: "/images/audiences/university-students.jpg",
    imageAlt: "Young university students sharing a moment outdoors",
    imagePosition: "center center",
  },
  {
    id: "graduates",
    title: "Graduates",
    icon: Briefcase,
    image: "/images/audiences/graduates.jpg",
    imageAlt: "Young graduates walking together",
    imagePosition: "center 40%",
  },
  {
    id: "young-professionals",
    title: "Young professionals",
    icon: Globe,
    image: "/images/audiences/young-professionals.jpg",
    imageAlt: "Young professionals connecting at an international event",
    imagePosition: "center center",
  },
  {
    id: "first-generation-opportunity-seekers",
    title: "First-generation opportunity seekers",
    icon: Heart,
    image: "/images/audiences/first-generation-opportunity-seekers.jpg",
    imageAlt: "Young professional participating in a collaborative discussion",
    imagePosition: "center 40%",
  },
  {
    id: "governance-and-public-leadership",
    title: "Young people interested in governance, policy, leadership, or public service",
    icon: Mic,
    image: "/images/audiences/governance-and-public-leadership.jpg",
    imageAlt: "Young women discussing documents in a leadership and academic setting",
    imagePosition: "center 40%",
  },
];
