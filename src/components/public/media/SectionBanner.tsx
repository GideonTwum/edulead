import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BackgroundOverlay } from "./BackgroundOverlay";
import { HeroCollage } from "./HeroCollage";
import { ROUTES } from "@/lib/constants";
import type { PublicImageRef } from "@/lib/public-images";

interface SectionBannerProps {
  headline: string;
  subtext: string;
  image: PublicImageRef;
  eyebrow?: string;
  showCta?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
  className?: string;
}

export function SectionBanner({
  headline,
  subtext,
  image,
  eyebrow,
  showCta = false,
  ctaHref = ROUTES.join,
  ctaLabel = "Join the Movement",
  secondaryCtaHref,
  secondaryCtaLabel,
  className,
}: SectionBannerProps) {
  return (
    <BackgroundOverlay image={image} className={cn("pb-16 pt-10 md:pb-24 md:pt-14", className)} minHeight="min-h-[22rem] md:min-h-[28rem]">
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
          {showCta ? (
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={ctaHref} className="btn-primary">
                {ctaLabel}
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

interface PageHeroProps {
  headline?: string;
  subtext?: string;
  variant?: "editorial" | "simple";
}

export function PageHero({
  headline = "Preparing Young Leaders to Shape Policy, Governance and Society.",
  subtext = "EduLead Network bridges the gap between education and leadership by equipping young people with mentorship, policy exposure, career guidance and the confidence to lead.",
  variant = "simple",
}: PageHeroProps) {
  if (variant === "editorial") {
    return (
      <section className="relative overflow-hidden gradient-navy pb-16 pt-8 md:pb-24 md:pt-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(181,211,52,0.12),transparent_45%)]" aria-hidden="true" />
        <div className="container-brand relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="mb-4 inline-block rounded-full bg-brand-green/20 px-4 py-1.5 text-sm font-semibold text-brand-green">
                Education for Leadership and Change
              </span>
              <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                {headline}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/80 md:text-xl">{subtext}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={ROUTES.join} className="btn-primary">
                  Join the Movement
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="#focus-areas" className="btn-white">
                  Explore Our Focus Areas
                </Link>
              </div>
            </div>
            <HeroCollage className="hidden lg:block" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <SectionBanner
      headline={headline}
      subtext={subtext}
      image={{ src: "/images/placeholders/banner.svg", alt: "Illustrative editorial banner placeholder" }}
    />
  );
}
