import type { Metadata } from "next";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { OpportunityFilters } from "@/components/public/OpportunityFilters";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { PUBLIC_IMAGES } from "@/lib/public-images";
import { getActiveOpportunities } from "@/lib/data/content";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata = buildPageMetadata(PAGE_SEO.opportunities);

export default async function OpportunitiesPage() {
  const opportunities = await getActiveOpportunities({ includeExpired: true });

  return (
    <>
      <HeroSection
        variant="banner"
        bannerImage={PUBLIC_IMAGES.resources.opportunities}
        eyebrow="Opportunities Directory"
        headline="Opportunities Directory"
        subtext="A curated directory of scholarships, fellowships, internships, and leadership opportunities for young people. We add new listings as we discover them."
        showCtas={false}
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
