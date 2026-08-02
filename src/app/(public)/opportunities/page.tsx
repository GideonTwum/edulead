import type { Metadata } from "next";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { OpportunityFilters } from "@/components/public/OpportunityFilters";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { getActiveOpportunities } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "Browse scholarships, fellowships, internships, and leadership opportunities curated for young people by EduLead Network.",
};

export default async function OpportunitiesPage() {
  const opportunities = await getActiveOpportunities({ includeExpired: true });

  return (
    <>
      <HeroSection
        headline="Opportunities Directory"
        subtext="A curated directory of scholarships, fellowships, internships, and leadership opportunities for young people. We add new listings as we discover them."
      />

      <section className="section-padding">
        <div className="container-brand">
          <Breadcrumbs items={[{ label: "Opportunities" }]} />
          <SectionHeading
            eyebrow="Directory"
            title="Leadership Opportunities"
            description="Filter by type, country, or location. Always verify details on the original application page before applying."
            align="left"
          />
          <OpportunityFilters opportunities={opportunities} />
        </div>
      </section>
    </>
  );
}
