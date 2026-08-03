"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { BrandShape } from "./BrandShape";
import { HeroCollage } from "./media/HeroCollage";
import { HeroBackgroundSlideshow } from "./HeroBackgroundSlideshow";
import { BackgroundOverlay } from "./media/BackgroundOverlay";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import type { PublicImageRef } from "@/lib/public-images";
import { PUBLIC_IMAGES } from "@/lib/public-images";
import { HERO_SLIDESHOW_IMAGES } from "@/config/hero-images";

interface HeroSectionProps {
  headline?: string;
  subtext?: string;
  variant?: "editorial" | "banner";
  bannerImage?: PublicImageRef;
  eyebrow?: string;
  showCtas?: boolean;
  primaryCtaHref?: string;
  primaryCtaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
}

export function HeroSection({
  headline = "Preparing Young Leaders to Shape Policy, Governance and Society.",
  subtext = "EduLead Network bridges the gap between education and leadership by equipping young people with mentorship, policy exposure, career guidance and the confidence to lead.",
  variant = "editorial",
  bannerImage = PUBLIC_IMAGES.resources.collaboration,
  eyebrow = "Education for Leadership and Change",
  showCtas = true,
  primaryCtaHref = ROUTES.join,
  primaryCtaLabel = "Join the Movement",
  secondaryCtaHref = "#focus-areas",
  secondaryCtaLabel = "Explore Our Focus Areas",
}: HeroSectionProps) {
  const { prefersReducedMotion } = useMotionConfig();

  if (variant === "banner") {
    return (
      <BackgroundOverlay
        image={bannerImage}
        overlay="gradient"
        minHeight="min-h-[22rem] md:min-h-[28rem]"
        className="pb-16 pt-10 md:pb-24 md:pt-14"
      >
        <div className="container-brand section-padding !py-0">
          <div className="max-w-3xl">
            {eyebrow ? (
              <span className="mb-4 inline-block rounded-full bg-brand-green/20 px-4 py-1.5 text-sm font-semibold text-brand-green">
                {eyebrow}
              </span>
            ) : null}
            <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">{subtext}</p>
            {showCtas ? (
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={primaryCtaHref} className="btn-primary">
                  {primaryCtaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                {secondaryCtaHref && secondaryCtaLabel ? (
                  <Link href={secondaryCtaHref} className="btn-white">
                    {secondaryCtaLabel}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </BackgroundOverlay>
    );
  }

  return (
    <section className="relative overflow-hidden pb-20 pt-8 md:pb-28 md:pt-12">
      {/* Layer 1: slideshow */}
      <HeroBackgroundSlideshow images={HERO_SLIDESHOW_IMAGES} className="z-0" />

      {/* Layer 2: navy gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[rgba(15,24,79,0.82)] to-[rgba(18,31,96,0.78)] md:from-[rgba(15,24,79,0.82)] md:to-[rgba(18,31,96,0.78)] max-md:from-[rgba(15,24,79,0.88)] max-md:to-[rgba(18,31,96,0.84)]"
        aria-hidden="true"
      />

      {/* Layer 3: existing brand shapes / dotted grid */}
      <BrandShape variant="circle" className="right-0 top-0 z-[2] h-96 w-96" />
      <BrandShape variant="circle" className="bottom-0 left-0 z-[2] h-64 w-64 bg-brand-green/10" />
      <BrandShape variant="dots" className="inset-0 z-[2] opacity-20" />

      <div className="container-brand relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.span
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-block rounded-full bg-brand-green/20 px-4 py-1.5 text-sm font-semibold text-brand-green"
            >
              {eyebrow}
            </motion.span>

            <motion.h1
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
            >
              {headline}
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg leading-relaxed text-white/80 md:text-xl"
            >
              {subtext}
            </motion.p>

            {showCtas ? (
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link href={primaryCtaHref} className="btn-primary">
                  {primaryCtaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                {secondaryCtaHref && secondaryCtaLabel ? (
                  <Link href={secondaryCtaHref} className="btn-white">
                    {secondaryCtaLabel}
                  </Link>
                ) : null}
              </motion.div>
            ) : null}
          </div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <HeroCollage />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
