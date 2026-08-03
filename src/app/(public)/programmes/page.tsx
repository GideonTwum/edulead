import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ProgrammeCard } from "@/components/public/ProgrammeCard";
import { EmptyState } from "@/components/public/EmptyState";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import { BackgroundOverlay } from "@/components/public/media";
import { ROUTES } from "@/lib/constants";
import { PUBLIC_IMAGES } from "@/lib/public-images";
import { getPublishedProgrammes } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "Explore EduLead Network's leadership development programmes — mentorship, policy training, and career guidance for young people.",
};

export default async function ProgrammesPage() {
  const programmes = await getPublishedProgrammes();

  return (
    <>
      <HeroSection
        variant="banner"
        bannerImage={PUBLIC_IMAGES.programmes.default}
        eyebrow="Leadership Development"
        headline="Our Programmes"
        subtext="We are designing leadership development programmes across mentorship, policy training, and career guidance. Explore what we are building."
        showCtas
        primaryCtaHref={ROUTES.join}
        primaryCtaLabel="Express Your Interest"
        secondaryCtaHref="#programmes-list"
        secondaryCtaLabel="Browse Programmes"
      />

      <section id="programmes-list" className="section-padding">
        <div className="container-brand">
          <Breadcrumbs items={[{ label: "Programmes" }]} />
          <SectionHeading
            eyebrow="What We Are Building"
            title="Leadership Development Programmes"
            description="These programmes are in various stages of development. Express your interest to be notified when they launch."
            align="left"
          />

          {programmes.length > 0 ? (
            <div className="space-y-8">
              {programmes.map((p, i) => {
                const layout =
                  i % 3 === 1 ? "featured" : i % 3 === 2 ? "featured-reverse" : "default";
                return (
                  <ProgrammeCard key={p.id} programme={p} layout={layout} />
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Programmes Coming Soon"
              description="We are designing our first leadership development programmes. Join our newsletter to be informed when they launch."
              image={PUBLIC_IMAGES.programmes.default}
              action={<Link href={ROUTES.join} className="btn-primary">Join the Movement</Link>}
            />
          )}
        </div>
      </section>

      <BackgroundOverlay image={PUBLIC_IMAGES.sections.newsletter} overlay="navy" minHeight="min-h-0">
        <div className="container-brand section-padding">
          <div className="mx-auto max-w-2xl">
            <NewsletterForm />
          </div>
        </div>
      </BackgroundOverlay>
    </>
  );
}
