"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/public/SectionHeading";
import { FounderArtwork } from "@/components/public/FounderArtwork";
import { useMotionConfig } from "@/hooks/useMotionConfig";

const FOUNDER_NAME = "Elizabeth Dansoa Osei";
const FOUNDER_ROLE = "Founder, EduLead Network";

export function MeetTheFounderSection() {
  const { fadeInUp, prefersReducedMotion } = useMotionConfig();
  const ContentWrapper = !prefersReducedMotion ? motion.div : "div";
  const contentMotion = !prefersReducedMotion ? fadeInUp : {};

  return (
    <section
      id="founder"
      className="scroll-mt-24 section-padding bg-white"
    >
      <div className="container-brand">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FounderArtwork
            variant="full"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          <ContentWrapper {...contentMotion}>
            <SectionHeading
              eyebrow="Meet the Founder"
              title={FOUNDER_NAME}
              align="left"
              className="!mb-4"
            />
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-green-dark">
              {FOUNDER_ROLE}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-brand-grey">
              Elizabeth Dansoa Osei founded EduLead Network to create stronger pathways between
              education, leadership development and opportunity. Her vision is to support young
              people with the confidence, skills and networks needed to contribute meaningfully to
              policy, governance and societal transformation.
            </p>
          </ContentWrapper>
        </div>
      </div>
    </section>
  );
}
