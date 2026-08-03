import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { FocusAreaCard } from "@/components/public/FocusAreaCard";
import { FounderMessage } from "@/components/public/FounderMessage";
import { TeamCard } from "@/components/public/TeamCard";
import { JoinPathCard } from "@/components/public/JoinPathCard";
import { AudienceCardsGrid } from "@/components/public/AudienceCardsGrid";
import { BrandShape, SectionDivider } from "@/components/public/BrandShape";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import {
  BackgroundOverlay,
  SplitImageSection,
} from "@/components/public/media";
import {
  CORE_VALUES,
  FOCUS_AREAS,
  JOIN_PATHWAYS,
  ROUTES,
} from "@/lib/constants";
import { PUBLIC_IMAGES } from "@/lib/public-images";
import { getPageSections, getSection } from "@/lib/data/settings";
import { getActiveTeamMembers } from "@/lib/data/content";
import { PageKey } from "@prisma/client";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about EduLead Network — our story, vision, mission, and approach to bridging the gap between education and leadership.",
};

const DEFAULT_OBJECTIVES = [
  "Provide structured mentorship and coaching for young people navigating career transitions",
  "Deliver policy and leadership training that builds practical governance skills",
  "Guide youth through scholarships, fellowships, and pathways into public service",
  "Facilitate youth policy dialogue with practitioners and policymakers",
  "Strengthen civic engagement and communication skills for emerging leaders",
];

export default async function AboutPage() {
  const [sections, teamMembers] = await Promise.all([
    getPageSections(PageKey.ABOUT),
    getActiveTeamMembers(),
  ]);

  const hero = getSection(sections, "hero");
  const leadershipProblem = getSection(sections, "leadership-problem");
  const story = getSection(sections, "story");
  const visionMission = getSection(sections, "vision-mission");
  const objectives = getSection(sections, "objectives");
  const approach = getSection(sections, "approach");
  const whoWeServe = getSection(sections, "who-we-serve");
  const founder = getSection(sections, "founder");
  const teamPreview = getSection(sections, "team-preview");
  const joinCta = getSection(sections, "join-cta");

  const visionMeta = visionMission?.metadata as { vision?: string; mission?: string } | null;
  const objectivesList =
    (objectives?.metadata as { items?: string[] } | null)?.items ?? DEFAULT_OBJECTIVES;

  const previewMembers = teamMembers.slice(0, 4);

  return (
    <>
      <HeroSection
        variant="banner"
        bannerImage={PUBLIC_IMAGES.sections.aboutStory}
        eyebrow="About EduLead"
        headline={hero?.heading ?? "About EduLead Network"}
        subtext={
          hero?.body ??
          "We are an emerging youth leadership network building structured pathways from education to policy, governance, and impact-driven careers."
        }
        showCtas={false}
      />

      <section className="section-padding bg-white">
        <div className="container-brand">
          <Breadcrumbs items={[{ label: "About" }]} />
          <SectionHeading
            eyebrow="The Challenge"
            title={leadershipProblem?.heading ?? "The Leadership Readiness Gap"}
            description={
              leadershipProblem?.body ??
              "Across many countries, a persistent gap exists between education and leadership readiness. Students gain academic qualifications but often lack structured pathways into policy, governance, and high-impact careers. EduLead Network was founded to address this gap."
            }
            align="left"
          />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-brand">
          <SplitImageSection image={PUBLIC_IMAGES.sections.aboutStory} imagePosition="right">
            <SectionHeading
              eyebrow="Our Story"
              title={story?.heading ?? "Why EduLead Exists"}
              description={
                story?.body ??
                "EduLead Network is being built in response to a clear need: young people deserve more than academic credentials — they deserve mentorship, policy exposure, and practical guidance as they transition into leadership roles. We are an early-stage organisation, actively designing our programmes and building our community."
              }
              align="left"
            />
          </SplitImageSection>
        </div>
      </section>

      <BackgroundOverlay image={PUBLIC_IMAGES.sections.visionMission} overlay="navy-heavy">
        <div className="container-brand section-padding">
          <BrandShape variant="circle" className="right-0 top-0 h-64 w-64 opacity-40" />
          <SectionHeading eyebrow="Purpose" title="Vision & Mission" light align="left" />
          <div className="relative grid gap-8 lg:grid-cols-2">
            <div className="rounded-brand-lg border border-white/10 bg-white/10 p-8 backdrop-blur-sm">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-green">Vision</h3>
              <p className="text-lg leading-relaxed text-white">
                {visionMeta?.vision ??
                  "To develop a generation of young leaders equipped with skills, confidence, and networks to shape policy, governance, and societal transformation."}
              </p>
            </div>
            <div className="rounded-brand-lg border border-white/10 bg-white/10 p-8 backdrop-blur-sm">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-green">Mission</h3>
              <p className="text-lg leading-relaxed text-white">
                {visionMeta?.mission ??
                  "EduLead Network exists to bridge the gap between education and leadership by providing structured mentorship, policy exposure, and career development support to young people transitioning into public service, governance, and impact-driven careers."}
              </p>
            </div>
          </div>
        </div>
      </BackgroundOverlay>

      <section className="section-padding bg-white">
        <div className="container-brand">
          <SectionHeading
            eyebrow="Goals"
            title={objectives?.heading ?? "Our Objectives"}
            description={objectives?.body ?? "These are the outcomes we are working toward as we build EduLead Network."}
            align="left"
          />
          <ul className="mx-auto max-w-3xl space-y-4">
            {objectivesList.map((item, i) => (
              <li key={i} className="flex items-start gap-4 rounded-brand-lg bg-brand-off-white p-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-brand-green">
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed text-brand-text">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-brand">
          <SectionHeading
            eyebrow="Principles"
            title="Core Values"
            description="The values that guide how we engage with young people, mentors, and partners."
            align="left"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {CORE_VALUES.map((value) => (
              <div key={value.title} className="card-brand">
                <h3 className="font-display text-lg font-bold text-brand-navy">{value.title}</h3>
                <p className="mt-2 text-sm text-brand-grey">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="section-padding bg-white">
        <div className="container-brand">
          <SplitImageSection image={PUBLIC_IMAGES.sections.aboutApproach} imagePosition="left">
            <SectionHeading
              eyebrow="How We Work"
              title={approach?.heading ?? "Our Approach"}
              description={
                approach?.body ??
                "We take a practical, mentorship-led approach. Rather than one-off events, we are building sustained engagement — connecting young people with mentors, policy practitioners, and career guidance over time. As an emerging organisation, we are transparent about what we are building and invite you to grow with us."
              }
              align="left"
            />
          </SplitImageSection>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FOCUS_AREAS.map((area) => (
              <FocusAreaCard key={area.title} {...area} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-brand">
          <SectionHeading
            eyebrow="Audience"
            title={whoWeServe?.heading ?? "Who We Serve"}
            description={
              whoWeServe?.body ??
              "EduLead Network is designed for young people at various stages of their leadership journey."
            }
            align="left"
          />
          <AudienceCardsGrid />
        </div>
      </section>

      {founder && (
        <section className="section-padding bg-white">
          <div className="container-brand">
            <SectionHeading eyebrow="Leadership" title="Founder's Message" align="left" />
            <FounderMessage
              name={founder.heading ?? ""}
              title={founder.subheading ?? ""}
              message={founder.body ?? ""}
              photoUrl={founder.imageUrl}
              linkedinUrl={founder.buttonUrl}
            />
          </div>
        </section>
      )}

      {previewMembers.length > 0 && (
        <section className="section-padding">
          <div className="container-brand">
            <SectionHeading
              eyebrow="People"
              title={teamPreview?.heading ?? "Our Team"}
              description={teamPreview?.body ?? "Meet the people building EduLead Network."}
              align="left"
            />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {previewMembers.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href={ROUTES.team} className="btn-secondary">
                Meet the Full Team <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <BackgroundOverlay image={PUBLIC_IMAGES.sections.join} overlay="gradient" minHeight="min-h-0">
        <div className="container-brand section-padding">
          <SectionHeading
            eyebrow="Get Involved"
            title={joinCta?.heading ?? "Join the Movement"}
            description={
              joinCta?.body ??
              "Whether you are a young person, mentor, volunteer, partner, or supporter — there is a place for you in EduLead Network."
            }
            light
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {JOIN_PATHWAYS.map((path) => (
              <JoinPathCard key={path.type} {...path} />
            ))}
          </div>
        </div>
      </BackgroundOverlay>
    </>
  );
}
