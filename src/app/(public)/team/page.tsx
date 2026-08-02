import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { TeamCard } from "@/components/public/TeamCard";
import { EmptyState } from "@/components/public/EmptyState";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ROUTES } from "@/lib/constants";
import { getActiveTeamMembers } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the people building EduLead Network.",
};

export default async function TeamPage() {
  const members = await getActiveTeamMembers();

  return (
    <>
      <HeroSection
        headline="Our Team"
        subtext="Meet the people building EduLead Network — a growing team committed to youth leadership development."
      />

      <section className="section-padding">
        <div className="container-brand">
          <Breadcrumbs items={[{ label: "Team" }]} />
          <SectionHeading
            eyebrow="People"
            title="The EduLead Team"
            description="We are an emerging organisation building our team. Profiles will be updated as our leadership structure develops."
            align="left"
          />

          {members.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Team Profiles Coming Soon"
              description="We are building our leadership team. Check back soon or join our community to stay connected."
              action={<Link href={ROUTES.join} className="btn-primary">Join the Movement</Link>}
            />
          )}
        </div>
      </section>
    </>
  );
}
