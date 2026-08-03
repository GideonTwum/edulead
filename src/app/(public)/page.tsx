import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { FocusAreaCard } from "@/components/public/FocusAreaCard";
import { ProgrammeCard } from "@/components/public/ProgrammeCard";
import { EventCard } from "@/components/public/EventCard";
import { OpportunityCard } from "@/components/public/OpportunityCard";
import { ArticleCard } from "@/components/public/ArticleCard";
import { FounderMessage } from "@/components/public/FounderMessage";
import { JoinPathCard } from "@/components/public/JoinPathCard";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import { EmptyState } from "@/components/public/EmptyState";
import { AudienceCardsGrid } from "@/components/public/AudienceCardsGrid";
import { LeadershipGapImage } from "@/components/public/LeadershipGapImage";
import { BrandShape, SectionDivider } from "@/components/public/BrandShape";
import { BackgroundOverlay } from "@/components/public/media";
import {
  FOCUS_AREAS,
  JOIN_PATHWAYS,
  ROUTES,
} from "@/lib/constants";
import { PUBLIC_IMAGES } from "@/lib/public-images";
import { getPageSections, getSection } from "@/lib/data/settings";
import {
  getFeaturedProgrammes,
  getUpcomingEvents,
  getActiveOpportunities,
  getPublishedArticles,
} from "@/lib/data/content";
import { PageKey } from "@prisma/client";

export const metadata: Metadata = {
  title: "Home",
  description:
    "EduLead Network bridges the gap between education and leadership by equipping young people with mentorship, policy exposure, and career guidance.",
};

export default async function HomePage() {
  const [sections, programmes, events, opportunities, articles] = await Promise.all([
    getPageSections(PageKey.HOME),
    getFeaturedProgrammes(3),
    getUpcomingEvents(3),
    getActiveOpportunities(),
    getPublishedArticles({ limit: 3 }),
  ]);

  const visionSection = getSection(sections, "vision-mission");
  const founderSection = getSection(sections, "founder-message");
  const whySection = getSection(sections, "why-edulead");

  const vision = visionSection?.metadata
    ? (visionSection.metadata as { vision?: string; mission?: string })
    : null;

  return (
    <>
      <HeroSection
        variant="editorial"
        headline={getSection(sections, "hero")?.heading ?? undefined}
        subtext={getSection(sections, "hero")?.body ?? undefined}
      />

      {/* Leadership Gap */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <SectionHeading
            eyebrow="The Challenge"
            title={whySection?.heading ?? "Education Should Prepare Young People to Lead."}
            description={
              whySection?.body ??
              "Across many countries, a persistent gap exists between education and leadership readiness. Students gain academic qualifications but often lack structured pathways into policy, governance, and high-impact careers."
            }
          />

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="mx-auto w-full max-w-xl">
              <div className="grid gap-4 md:grid-cols-5 md:gap-2">
                {[
                  { step: "Education", desc: "Strong academic foundation" },
                  { step: "→", desc: "Limited leadership exposure" },
                  { step: "→", desc: "Limited mentor access" },
                  { step: "→", desc: "Career navigation challenges" },
                  { step: "EduLead", desc: "Bridges the gap", highlight: true },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-4 text-center ${
                      item.highlight
                        ? "gradient-navy text-white md:col-span-1"
                        : "bg-brand-off-white"
                    }`}
                  >
                    <p
                      className={`font-display text-sm font-bold ${item.highlight ? "text-brand-green" : "text-brand-navy"}`}
                    >
                      {item.step}
                    </p>
                    <p className={`mt-1 text-xs ${item.highlight ? "text-white/80" : "text-brand-grey"}`}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <LeadershipGapImage />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <BackgroundOverlay image={PUBLIC_IMAGES.sections.visionMission} overlay="navy-heavy">
        <div className="container-brand section-padding">
          <BrandShape variant="circle" className="right-0 top-0 h-64 w-64 opacity-40" />
          <div className="relative grid gap-12 lg:grid-cols-2">
            <div className="rounded-brand-lg border border-white/10 bg-white/10 p-8 backdrop-blur-sm">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-green">Vision</h3>
              <p className="text-lg leading-relaxed text-white md:text-xl">
                {vision?.vision ??
                  "To develop a generation of young leaders who are equipped with skills, confidence, and networks to shape policy, governance, and societal transformation."}
              </p>
            </div>
            <div className="rounded-brand-lg border border-white/10 bg-white/10 p-8 backdrop-blur-sm">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-green">Mission</h3>
              <p className="text-lg leading-relaxed text-white md:text-xl">
                {vision?.mission ??
                  "EduLead Network exists to bridge the gap between education and leadership by providing structured mentorship, policy exposure, and career development support to young people transitioning from education into public service, governance, and impact-driven careers."}
              </p>
            </div>
          </div>
        </div>
      </BackgroundOverlay>

      <SectionDivider />

      {/* Focus Areas */}
      <section id="focus-areas" className="section-padding">
        <div className="container-brand">
          <SectionHeading
            eyebrow="What We Do"
            title="Our Focus Areas"
            description="EduLead Network is being built around six pillars of leadership development for young people."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FOCUS_AREAS.map((area) => (
              <FocusAreaCard key={area.title} {...area} />
            ))}
          </div>
        </div>
      </section>

      {/* Planned Programmes */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <SectionHeading
            eyebrow="What We Are Building"
            title="Our Planned Programmes"
            description="These are the areas of engagement we are developing for young leaders."
          />
          {programmes.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {programmes.map((p) => (
                  <ProgrammeCard key={p.id} programme={p} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href={ROUTES.programmes} className="btn-secondary">
                  View All Programmes <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          ) : (
            <EmptyState
              title="Programmes Coming Soon"
              description="We are designing our first leadership development programmes. Join our newsletter to be informed when they launch."
              image={PUBLIC_IMAGES.programmes.default}
              action={
                <Link href="#newsletter" className="btn-primary">
                  Subscribe to Updates
                </Link>
              }
            />
          )}
        </div>
      </section>

      {/* Who EduLead is For */}
      <section className="section-padding">
        <div className="container-brand">
          <SectionHeading
            eyebrow="Who We Serve"
            title="Who EduLead Is For"
            description="EduLead Network is designed for young people at various stages of their leadership journey."
          />
          <AudienceCardsGrid />
        </div>
      </section>

      {founderSection && (
        <section className="section-padding bg-white">
          <div className="container-brand">
            <SectionHeading eyebrow="Leadership" title="Founder's Message" />
            <FounderMessage
              name={founderSection.heading ?? ""}
              title={founderSection.subheading ?? ""}
              message={founderSection.body ?? ""}
              photoUrl={founderSection.imageUrl}
              linkedinUrl={founderSection.buttonUrl}
            />
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="section-padding">
        <div className="container-brand">
          <SectionHeading eyebrow="Events" title="Upcoming Events" />
          {events.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {events.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href={ROUTES.events} className="btn-secondary">
                  View All Events
                </Link>
              </div>
            </>
          ) : (
            <EmptyState
              title="Events Coming Soon"
              description="We are preparing our first series of leadership conversations. Join our newsletter to be informed when registration opens."
              image={PUBLIC_IMAGES.resources.events}
              action={
                <Link href="#newsletter" className="btn-primary">
                  Join Newsletter
                </Link>
              }
            />
          )}
        </div>
      </section>

      {/* Latest Opportunities */}
      <section className="section-padding bg-white">
        <div className="container-brand">
          <SectionHeading eyebrow="Opportunities" title="Latest Opportunities" />
          {opportunities.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {opportunities.slice(0, 3).map((o) => (
                  <OpportunityCard key={o.id} opportunity={o} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href={ROUTES.opportunities} className="btn-secondary">
                  Browse All Opportunities
                </Link>
              </div>
            </>
          ) : (
            <EmptyState
              title="Opportunities Directory"
              description="We are curating leadership opportunities for young people. Check back soon or subscribe for updates."
              image={PUBLIC_IMAGES.resources.opportunities}
            />
          )}
        </div>
      </section>

      {/* Latest Insights */}
      <section className="section-padding">
        <div className="container-brand">
          <SectionHeading eyebrow="Insights" title="Latest Insights" />
          {articles.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href={ROUTES.insights} className="btn-secondary">
                  Read More Insights
                </Link>
              </div>
            </>
          ) : (
            <EmptyState
              title="Insights Coming Soon"
              description="We will share leadership resources, policy perspectives, and career guidance articles here."
              image={PUBLIC_IMAGES.resources.insights}
            />
          )}
        </div>
      </section>

      {/* Join the Movement */}
      <BackgroundOverlay image={PUBLIC_IMAGES.sections.join} overlay="gradient" minHeight="min-h-0">
        <div className="container-brand section-padding">
          <SectionHeading
            eyebrow="Get Involved"
            title="Join the Movement"
            description="Whether you are a young person, mentor, volunteer, partner, or supporter — there is a place for you in EduLead Network."
            light
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {JOIN_PATHWAYS.map((path) => (
              <JoinPathCard key={path.type} {...path} />
            ))}
          </div>
        </div>
      </BackgroundOverlay>

      {/* Newsletter */}
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
