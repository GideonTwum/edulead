import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { FocusAreaCard } from "@/components/public/FocusAreaCard";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { BrandShape } from "@/components/public/BrandShape";
import { CORE_VALUES, FOCUS_AREAS, ROUTES } from "@/lib/constants";
import { getPageSections, getSection } from "@/lib/data/settings";
import { PageKey } from "@prisma/client";
import { buildPageMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata = buildPageMetadata({
  ...PAGE_SEO.about,
  useAbsoluteTitle: true,
});

const DEFAULT_OBJECTIVES = [
  "Provide structured mentorship and coaching for young people navigating career transitions",
  "Deliver policy and leadership training that builds practical governance skills",
  "Guide youth through scholarships, fellowships, and pathways into public service",
  "Facilitate youth policy dialogue with practitioners and policymakers",
  "Strengthen civic engagement and communication skills for emerging leaders",
];

export default async function AboutPage() {
  const sections = await getPageSections(PageKey.ABOUT);

  const hero = getSection(sections, "hero");
  const story = getSection(sections, "story");
  const visionMission = getSection(sections, "vision-mission");
  const objectives = getSection(sections, "objectives");

  const visionMeta = visionMission?.metadata as { vision?: string; mission?: string } | null;
  const objectivesList =
    (objectives?.metadata as { items?: string[] } | null)?.items ?? DEFAULT_OBJECTIVES;

  return (
    <>
      <HeroSection
        variant="editorial"
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
            eyebrow="Who We Are"
            title={story?.heading ?? "Why EduLead Exists"}
            description={
              story?.body ??
              "EduLead Network is being built in response to a clear need: young people deserve more than academic credentials — they deserve mentorship, policy exposure, and practical guidance as they transition into leadership roles."
            }
            align="left"
          />
        </div>
      </section>

      <section className="gradient-navy section-padding">
        <div className="container-brand">
          <BrandShape variant="circle" className="right-0 top-0 h-64 w-64 opacity-20" />
          <SectionHeading eyebrow="Purpose" title="Vision & Mission" light align="left" />
          <div className="relative grid gap-8 lg:grid-cols-2">
            <div className="rounded-brand-lg border border-white/10 bg-white/10 p-8">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-green">Vision</h3>
              <p className="text-lg leading-relaxed text-white">
                {visionMeta?.vision ??
                  "To develop a generation of young leaders equipped with skills, confidence, and networks to shape policy, governance, and societal transformation."}
              </p>
            </div>
            <div className="rounded-brand-lg border border-white/10 bg-white/10 p-8">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-green">Mission</h3>
              <p className="text-lg leading-relaxed text-white">
                {visionMeta?.mission ??
                  "EduLead Network exists to bridge the gap between education and leadership by providing structured mentorship, policy exposure, and career development support to young people."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-brand">
          <SectionHeading
            eyebrow="Goals"
            title={objectives?.heading ?? "What EduLead Seeks to Achieve"}
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

      <section className="section-padding bg-brand-off-white">
        <div className="container-brand">
          <SectionHeading
            eyebrow="Focus"
            title="Our Focus Areas"
            description="The pillars that guide EduLead Network's work with young people."
            align="left"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FOCUS_AREAS.map((area) => (
              <FocusAreaCard key={area.title} {...area} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
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

      <section className="gradient-navy section-padding">
        <div className="container-brand text-center">
          <SectionHeading
            eyebrow="People"
            title="Meet the Team"
            description="Learn about the people supporting EduLead Network."
            light
          />
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={ROUTES.team} className="btn-primary">
              Meet the Team <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={ROUTES.contact} className="btn-secondary border-white/20 !text-white hover:!bg-white hover:!text-brand-navy">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
