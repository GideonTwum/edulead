import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { EventCard } from "@/components/public/EventCard";
import { EmptyState } from "@/components/public/EmptyState";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ROUTES } from "@/lib/constants";
import { PUBLIC_IMAGES } from "@/lib/public-images";
import { getPublishedEvents } from "@/lib/data/content";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata = buildPageMetadata(PAGE_SEO.events);

export default async function EventsPage() {
  const events = await getPublishedEvents();
  const upcoming = events.filter((e) => e.status === "UPCOMING" || e.status === "ONGOING");
  const past = events.filter((e) => e.status === "COMPLETED" || e.status === "CANCELLED");

  return (
    <>
      <HeroSection
        variant="banner"
        bannerImage={PUBLIC_IMAGES.resources.events}
        eyebrow="Events & Workshops"
        headline="Events"
        subtext="Workshops, policy dialogues, and leadership conversations. We are preparing our first events — register your interest to stay informed."
        showCtas
        primaryCtaHref={ROUTES.join}
        primaryCtaLabel="Register Interest"
        secondaryCtaHref="#events-list"
        secondaryCtaLabel="View Events"
      />

      <section id="events-list" className="section-padding">
        <div className="container-brand">
          <Breadcrumbs items={[{ label: "Events" }]} />

          {upcoming.length > 0 ? (
            <>
              <SectionHeading
                eyebrow="Upcoming"
                title="Upcoming Events"
                description="Register for our upcoming leadership events."
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
              description="We are preparing our first series of leadership conversations. Join our community to be informed when registration opens."
              image={PUBLIC_IMAGES.resources.events}
              action={<Link href={ROUTES.join} className="btn-primary">Join the Movement</Link>}
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
    </>
  );
}
