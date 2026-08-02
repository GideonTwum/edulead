import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ProgrammeCard } from "@/components/public/ProgrammeCard";
import { EmptyState } from "@/components/public/EmptyState";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import { ROUTES } from "@/lib/constants";
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
        headline="Our Programmes"
        subtext="We are designing leadership development programmes across mentorship, policy training, and career guidance. Explore what we are building."
      />

      <section className="section-padding">
        <div className="container-brand">
          <Breadcrumbs items={[{ label: "Programmes" }]} />
          <SectionHeading
            eyebrow="What We Are Building"
            title="Leadership Development Programmes"
            description="These programmes are in various stages of development. Express your interest to be notified when they launch."
            align="left"
          />

          {programmes.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {programmes.map((p) => (
                <ProgrammeCard key={p.id} programme={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Programmes Coming Soon"
              description="We are designing our first leadership development programmes. Join our newsletter to be informed when they launch."
              action={<Link href={ROUTES.join} className="btn-primary">Join the Movement</Link>}
            />
          )}
        </div>
      </section>

      <section className="section-padding bg-brand-off-white">
        <div className="container-brand max-w-2xl">
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
