import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/public/SectionHeading";
import { TeamCard } from "@/components/public/TeamCard";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { HeroSection } from "@/components/public/HeroSection";
import { ROUTES } from "@/lib/constants";
import { getActiveTeamMembers } from "@/lib/data/content";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata = buildPageMetadata({
  ...PAGE_SEO.team,
  useAbsoluteTitle: true,
});

export default async function TeamPage() {
  const members = await getActiveTeamMembers();

  return (
    <>
      <HeroSection
        variant="editorial"
        eyebrow="Team"
        headline="Meet the Team"
        subtext="The people supporting EduLead Network's mission to develop youth leaders through education, mentorship and civic engagement."
        showCtas={false}
      />

      <section className="section-padding">
        <div className="container-brand">
          <Breadcrumbs items={[{ label: "Team" }]} />
          <SectionHeading
            eyebrow="Leadership & Team"
            title="Meet the Team"
            description="EduLead Network is supported by a growing team committed to youth leadership, education and societal impact."
            align="left"
          />

          {members.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <p className="text-brand-grey">Team profiles will be published here soon.</p>
          )}

          <div className="mt-12 text-center">
            <Link href={ROUTES.contact} className="btn-secondary inline-flex">
              Contact EduLead Network <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
