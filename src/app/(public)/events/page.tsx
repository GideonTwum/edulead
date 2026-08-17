import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { EventCard } from "@/components/public/EventCard";
import { EmptyState } from "@/components/public/EmptyState";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ROUTES } from "@/lib/constants";
import { getPublishedEvents } from "@/lib/data/content";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata = buildPageMetadata({
  ...PAGE_SEO.events,
  useAbsoluteTitle: true,
});

export default async function EventsPage() {
  const events = await getPublishedEvents();
  const upcoming = events.filter((e) => e.status === "UPCOMING" || e.status === "ONGOING");
  const past = events.filter((e) => e.status === "COMPLETED" || e.status === "CANCELLED");

  return (
    <>
      <HeroSection
        variant="editorial"
        eyebrow="Events & Media"
        headline="Events & Media"
        subtext="Upcoming leadership events, expos and policy dialogues from EduLead Network."
        showCtas={false}
      />

      <section id="events-list" className="section-padding">
        <div className="container-brand">
          <Breadcrumbs items={[{ label: "Events & Media" }]} />

          {upcoming.length > 0 ? (
            <>
              <SectionHeading
                eyebrow="Upcoming"
                title="Upcoming Events"
                description="Register for upcoming EduLead Network events."
                align="left"
              />
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="Events Coming Soon"
              description="Our upcoming events will be announced here."
              action={
                <Link href={ROUTES.join} className="btn-primary">
                  Join the Movement
                </Link>
              }
            />
          )}

          {past.length > 0 && (
            <div className="mt-16">
              <SectionHeading eyebrow="Archive" title="Past Events" align="left" />
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {past.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-brand-off-white">
        <div className="container-brand text-center">
          <SectionHeading
            eyebrow="Media"
            title="Event Highlights"
            description="Event photographs and highlights will appear here as they become available."
          />
          <Link href={ROUTES.join} className="btn-secondary inline-flex">
            Stay Connected <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
