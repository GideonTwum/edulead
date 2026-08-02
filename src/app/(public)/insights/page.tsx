import type { Metadata } from "next";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { InsightsListing } from "./InsightsListing";
import { getPublishedArticles } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Leadership resources, policy perspectives, and career guidance from EduLead Network.",
};

export default async function InsightsPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <HeroSection
        headline="Insights"
        subtext="Leadership resources, policy perspectives, and career guidance for young people navigating governance and public service."
      />

      <section className="section-padding">
        <div className="container-brand">
          <Breadcrumbs items={[{ label: "Insights" }]} />
          <SectionHeading
            eyebrow="Articles"
            title="Leadership Insights"
            description="Perspectives on education, policy, and youth leadership. We are building our content library — check back for new articles."
            align="left"
          />
          <InsightsListing articles={articles} />
        </div>
      </section>
    </>
  );
}
