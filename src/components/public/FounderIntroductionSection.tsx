"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/public/SectionHeading";
import { FounderArtwork } from "@/components/public/FounderArtwork";
import { ROUTES } from "@/lib/constants";
import { useMotionConfig } from "@/hooks/useMotionConfig";

const FOUNDER_NAME = "Elizabeth Dansoa Osei";
const FOUNDER_ROLE = "Founder, EduLead Network";

export function FounderIntroductionSection() {
  const { fadeInUp, prefersReducedMotion } = useMotionConfig();
  const ContentWrapper = !prefersReducedMotion ? motion.div : "div";
  const contentMotion = !prefersReducedMotion ? fadeInUp : {};

  return (
    <section className="section-padding bg-brand-off-white">
      <div className="container-brand">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <ContentWrapper {...contentMotion} className="order-2 lg:order-1">
            <SectionHeading
              eyebrow="Founder's Vision"
              title="A Vision Led by Purpose"
              align="left"
              className="!mb-6"
            />
            <p className="font-display text-xl font-bold text-brand-navy md:text-2xl">{FOUNDER_NAME}</p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-brand-green-dark">
              {FOUNDER_ROLE}
            </p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-grey">
              EduLead Network was founded with a vision to help young people move beyond academic
              achievement into leadership, opportunity and meaningful societal contribution.
            </p>
            <Link
              href={`${ROUTES.about}#founder`}
              className="btn-primary mt-8 inline-flex"
            >
              Meet Our Founder <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </ContentWrapper>

          <div className="order-1 lg:order-2">
            <FounderArtwork
              variant="preview"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
