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
    imageAlt: "Senior high school students participating in a school gathering",
    imagePosition: "center center",
  },
  {
    id: "university-students",
    title: "University students",
    icon: Users,
    image: "/images/audiences/university-students.jpg",
    imageAlt: "University students standing together with study materials",
    imagePosition: "center center",
  },
  {
    id: "graduates",
    title: "Graduates",
    icon: Briefcase,
    image: "/images/audiences/graduates.jpg",
    imageAlt: "Graduates celebrating after completing their studies",
    imagePosition: "center 35%",
  },
  {
    id: "young-professionals",
    title: "Young professionals",
    icon: Globe,
    image: "/images/audiences/young-professionals.jpg",
    imageAlt: "Young professionals collaborating around a laptop",
    imagePosition: "center center",
  },
  {
    id: "first-generation-opportunity-seekers",
    title: "First-generation opportunity seekers",
    icon: Heart,
    image: "/images/audiences/first-generation-opportunity-seekers.jpg",
    imageAlt: "Students participating in an interactive classroom session",
    imagePosition: "center center",
  },
  {
    id: "governance-and-public-leadership",
    title: "Young people interested in governance, policy, leadership, or public service",
    icon: Mic,
    image: "/images/audiences/governance-and-public-leadership.jpg",
    imageAlt: "Young professional speaking during a leadership presentation",
    imagePosition: "center 25%",
  },
];
