import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { JoinPathCard } from "@/components/public/JoinPathCard";
import { JoinForm } from "@/components/public/JoinForm";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { JOIN_PATHWAYS } from "@/lib/constants";
import { PUBLIC_IMAGES } from "@/lib/public-images";
import { getPageSections, getSection } from "@/lib/data/settings";
import { PageKey } from "@prisma/client";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata = buildPageMetadata({
  ...PAGE_SEO.join,
  useAbsoluteTitle: true,
});

export default async function JoinPage() {
  const sections = await getPageSections(PageKey.JOIN);
  const hero = getSection(sections, "hero");
  const intro = getSection(sections, "intro");

  return (
    <>
      <HeroSection
        variant="banner"
        bannerImage={PUBLIC_IMAGES.sections.join}
        eyebrow="Get Involved"
        headline={hero?.heading ?? "Join the Movement"}
        subtext={
          hero?.body ??
          "Whether you are a young person seeking mentorship, a professional willing to guide others, or an organisation looking to partner — there is a place for you in EduLead Network."
        }
        showCtas={false}
      />

      <section className="section-padding">
        <div className="container-brand">
          <Breadcrumbs items={[{ label: "Join Us" }]} />
          <SectionHeading
            eyebrow="Pathways"
            title="Choose Your Pathway"
            description={
              intro?.body ??
              "Select how you would like to engage with EduLead Network, then complete the form below."
            }
            align="left"
          />
          <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {JOIN_PATHWAYS.map((path) => (
              <JoinPathCard key={path.type} {...path} />
            ))}
          </div>

          <Suspense fallback={<div className="rounded-brand-lg bg-white p-8 shadow-brand animate-pulse h-96" />}>
            <JoinForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
