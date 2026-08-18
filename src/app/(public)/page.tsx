import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { FocusAreaCard } from "@/components/public/FocusAreaCard";
import { AudienceCardsGrid } from "@/components/public/AudienceCardsGrid";
import { EventCard } from "@/components/public/EventCard";
import { ArticleCard } from "@/components/public/ArticleCard";
import { JoinPathCard } from "@/components/public/JoinPathCard";
import { NewsletterForm } from "@/components/public/NewsletterForm";
import { EmptyState } from "@/components/public/EmptyState";
import { BrandShape } from "@/components/public/BrandShape";
import {
  FOCUS_AREAS,
  JOIN_PATHWAYS,
  ROUTES,
} from "@/lib/constants";
import { getPageSections, getSection, getSiteSettings } from "@/lib/data/settings";
import {
  getUpcomingEvents,
  getPublishedArticles,
  getActiveTeamMembers,
} from "@/lib/data/content";
import { PageKey } from "@prisma/client";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo";
import { OrganizationSchemaFromSettings } from "@/components/public/StructuredData";

export const metadata = buildPageMetadata({
  ...PAGE_SEO.home,
  useAbsoluteTitle: true,
});

export default async function HomePage() {
  const [sections, events, articles, teamMembers, settings] = await Promise.all([
    getPageSections(PageKey.HOME),
    getUpcomingEvents(1),
    getPublishedArticles({ limit: 3 }),
    getActiveTeamMembers(),
    getSiteSettings(),
  ]);

  const visionSection = getSection(sections, "vision-mission");
  const whySection = getSection(sections, "why-edulead");
  const vision = visionSection?.metadata
    ? (visionSection.metadata as { vision?: string; mission?: string })
    : null;

  const featuredEvent = events[0] ?? null;
  const featuredTeam = teamMembers.slice(0, 3);

  return (
    <>
      <OrganizationSchemaFromSettings {...settings} />
      <HeroSection
        variant="editorial"
        headline={getSection(sections, "hero")?.heading ?? undefined}
        subtext={getSection(sections, "hero")?.body ?? undefined}
      />

      <section className="section-padding bg-white">
        <div className="container-brand mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Who We Are"
            title="Education for Leadership and Change"
            description={
              whySection?.body ??
              "EduLead Network connects young people with mentorship, leadership education, policy exposure and career guidance — helping them move from academic achievement into meaningful societal contribution."
            }
          />
          <Link href={ROUTES.about} className="btn-secondary mt-2 inline-flex">
            Learn About EduLead <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="gradient-navy section-padding">
        <div className="container-brand">
          <BrandShape variant="circle" className="right-0 top-0 h-64 w-64 opacity-20" />
          <SectionHeading
            eyebrow="Our Purpose"
            title="Vision & Mission"
            light
            className="!mb-10"
          />
          <div className="relative grid gap-8 lg:grid-cols-2">
            <div className="rounded-brand-lg border border-white/10 bg-white/10 p-8">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-green">Vision</h3>
              <p className="text-lg leading-relaxed text-white">
                {vision?.vision ??
                  "To develop a generation of young leaders equipped with skills, confidence, and networks to shape policy, governance, and societal transformation."}
              </p>
            </div>
            <div className="rounded-brand-lg border border-white/10 bg-white/10 p-8">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-green">Mission</h3>
              <p className="text-lg leading-relaxed text-white">
                {vision?.mission ??
                  "EduLead Network exists to bridge the gap between education and leadership by providing structured mentorship, policy exposure, and career development support to young people."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="focus-areas" className="section-padding">
        <div className="container-brand">
          <SectionHeading
            eyebrow="What We Do"
            title="Our Focus Areas"
            description="EduLead Network supports youth leadership through mentorship, policy dialogue, career guidance and civic engagement."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FOCUS_AREAS.map((area) => (
              <FocusAreaCard key={area.title} {...area} />
            ))}
          </div>
        </div>
      </section>

      <section id="who-edulead-is-for" className="section-padding bg-brand-off-white">
        <div className="container-brand">
          <SectionHeading
            eyebrow="Our Audience"
            title="Who EduLead Is For"
            description="EduLead is designed for young people at different stages of their educational, professional and leadership journeys."
            className="!mb-10"
          />
          <AudienceCardsGrid />
        </div>
      </section>

      <section className="section-padding bg-brand-off-white">
        <div className="container-brand">
          <SectionHeading
            eyebrow="Events & Media"
            title="Upcoming Event"
            description="Join EduLead Network for leadership conversations, expos and policy dialogues."
            align="left"
          />
          {featuredEvent ? (
            <div className="max-w-2xl">
              <EventCard event={featuredEvent} />
              <div className="mt-8">
                <Link href={ROUTES.events} className="btn-secondary">
                  View Events & Media <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Events Coming Soon"
              description="Our upcoming events will be announced here. Join our community to stay informed."
              action={
                <Link href={ROUTES.join} className="btn-primary">
                  Join the Movement
                </Link>
              }
            />
          )}
        </div>
      </section>

      {articles.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-brand">
            <SectionHeading
              eyebrow="Publications"
              title="Latest Publications"
              description="Articles, commentary and resources from EduLead Network."
              align="left"
            />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
            <div className="mt-10">
              <Link href={ROUTES.publications} className="btn-secondary">
                View All Publications <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {featuredTeam.length > 0 && (
        <section className="section-padding bg-brand-off-white">
          <div className="container-brand text-center">
            <SectionHeading
              eyebrow="People"
              title="Meet the Team"
              description="The people supporting EduLead Network's mission to develop youth leaders."
            />
            <Link href={ROUTES.team} className="btn-primary inline-flex">
              Meet the Full Team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      <section className="gradient-navy section-padding">
        <div className="container-brand">
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
      </section>

      <section className="section-padding bg-brand-off-white" id="newsletter">
        <div className="container-brand mx-auto max-w-2xl">
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
