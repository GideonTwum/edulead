import type { Metadata } from "next";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { PublicationsListing } from "./PublicationsListing";
import { getPublishedArticles } from "@/lib/data/content";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata = buildPageMetadata(PAGE_SEO.publications);

export default async function PublicationsPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <HeroSection
        variant="editorial"
        eyebrow="Publications"
        headline="Leadership, Policy & Career Publications"
        subtext="Articles, policy perspectives, research and commentary from EduLead Network."
        showCtas={false}
      />

      <section className="section-padding">
        <div className="container-brand">
          <Breadcrumbs items={[{ label: "Publications" }]} />
          <SectionHeading
            eyebrow="Publications"
            title="From EduLead Network"
            description="Publications from EduLead Network will appear here — including articles, policy briefs, research and commentary."
            align="left"
          />
          <PublicationsListing articles={articles} />
        </div>
      </section>
    </>
  );
}
