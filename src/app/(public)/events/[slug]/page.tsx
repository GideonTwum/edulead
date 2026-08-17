import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Clock, ExternalLink, Video } from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { RichTextRenderer } from "@/components/public/RichTextRenderer";
import { EventRegistrationForm } from "@/components/public/EventRegistrationForm";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ROUTES } from "@/lib/constants";
import { getEventBySlug } from "@/lib/data/content";
import { absoluteUrl, buildDynamicMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { BreadcrumbSchemaFromPaths, EventSchema } from "@/components/public/StructuredData";

interface Props {
  params: Promise<{ slug: string }>;
}

const typeLabels: Record<string, string> = {
  WORKSHOP: "Workshop",
  WEBINAR: "Webinar",
  POLICY_DIALOGUE: "Policy Dialogue",
  SEMINAR: "Seminar",
  CONFERENCE: "Conference",
  NETWORKING_SESSION: "Networking Session",
  MENTORSHIP_SESSION: "Mentorship Session",
  TRAINING: "Training",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found", robots: { index: false, follow: false } };

  return buildDynamicMetadata({
    title: event.seoTitle ?? event.title,
    description: event.seoDescription ?? event.excerpt,
    path: ROUTES.event(event.slug),
    image: event.featuredImage,
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const registrationOpen =
    event.registrationFormEnabled &&
    event.status !== "COMPLETED" &&
    event.status !== "CANCELLED" &&
    (!event.registrationDeadline || new Date(event.registrationDeadline) >= new Date());

  return (
    <>
      <EventSchema
        name={event.title}
        description={event.seoDescription ?? event.excerpt}
        startDate={event.date.toISOString()}
        endDate={event.endDate?.toISOString()}
        venue={event.venue}
        onlineLink={event.onlineLink}
        url={absoluteUrl(ROUTES.event(event.slug))}
        image={event.featuredImage}
        status={event.status}
      />
      <BreadcrumbSchemaFromPaths
        crumbs={[
          { name: "Events & Media", path: ROUTES.events },
          { name: event.title },
        ]}
      />

      <HeroSection headline={event.title} subtext={event.excerpt} />

      <section className="section-padding">
        <div className="container-brand">
          <Breadcrumbs
            items={[
              { label: "Events & Media", href: ROUTES.events },
              { label: event.title },
            ]}
          />

          <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
            <div>
              {event.featuredImage ? (
                <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-brand-lg">
                  <Image src={event.featuredImage} alt={event.title} fill className="object-cover" priority />
                </div>
              ) : (
                <div
                  className="relative mb-8 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-brand-lg gradient-navy"
                  aria-hidden="true"
                >
                  <Calendar className="h-16 w-16 text-brand-green" />
                </div>
              )}

              <div className="mb-6">
                <span className="rounded-full bg-brand-green px-3 py-1 text-xs font-semibold text-brand-navy">
                  {typeLabels[event.eventType] ?? event.eventType}
                </span>
              </div>

              <RichTextRenderer content={event.description} />
            </div>

            <aside className="space-y-6">
              <div className="rounded-brand-lg bg-white p-6 shadow-brand">
                <h3 className="font-display text-lg font-bold text-brand-navy">Event Details</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-dark" aria-hidden="true" />
                    <div>
                      <dt className="font-medium text-brand-navy">Date</dt>
                      <dd className="text-brand-grey">
                        <time dateTime={event.date.toISOString()}>{formatDate(event.date)}</time>
                        {event.endDate && ` — ${formatDate(event.endDate)}`}
                      </dd>
                    </div>
                  </div>
                  {(event.startTime || event.endTime) && (
                    <div className="flex gap-3">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-dark" aria-hidden="true" />
                      <div>
                        <dt className="font-medium text-brand-navy">Time</dt>
                        <dd className="text-brand-grey">
                          {event.startTime}
                          {event.endTime && ` — ${event.endTime}`}
                          {event.timezone && ` (${event.timezone})`}
                        </dd>
                      </div>
                    </div>
                  )}
                  {event.venue && (
                    <div className="flex gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-dark" aria-hidden="true" />
                      <div>
                        <dt className="font-medium text-brand-navy">Venue</dt>
                        <dd className="text-brand-grey">{event.venue}</dd>
                      </div>
                    </div>
                  )}
                  {event.onlineLink && (
                    <div className="flex gap-3">
                      <Video className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-dark" aria-hidden="true" />
                      <div>
                        <dt className="font-medium text-brand-navy">Online</dt>
                        <dd className="text-brand-grey">Virtual event — link provided upon registration</dd>
                      </div>
                    </div>
                  )}
                  {event.capacity && (
                    <div>
                      <dt className="font-medium text-brand-navy">Capacity</dt>
                      <dd className="text-brand-grey">{event.capacity} participants</dd>
                    </div>
                  )}
                </dl>

                {event.registrationUrl && !event.registrationFormEnabled && (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-6 w-full justify-center"
                  >
                    Register <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              {registrationOpen && (
                <div id="register">
                  <EventRegistrationForm
                    eventId={event.id}
                    eventTitle={event.title}
                    eventDate={formatDate(event.date)}
                  />
                </div>
              )}

              {event.registrationFormEnabled && !registrationOpen && (
                <div className="rounded-brand-lg bg-brand-off-white p-6 text-center text-sm text-brand-grey">
                  Registration is currently closed for this event.
                </div>
              )}
            </aside>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href={ROUTES.events} className="btn-secondary">
              ← Back to Events & Media
            </Link>
            <Link href={ROUTES.join} className="btn-primary">
              Join the Movement
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
