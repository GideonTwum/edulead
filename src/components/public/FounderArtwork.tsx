"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import { PUBLIC_IMAGES } from "@/lib/public-images";

interface FounderArtworkProps {
  variant?: "preview" | "full";
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function FounderArtwork({
  variant = "full",
  className,
  sizes = "(max-width: 1024px) 100vw, 45vw",
  priority = false,
}: FounderArtworkProps) {
  const { fadeInUp, prefersReducedMotion } = useMotionConfig();
  const Wrapper = !prefersReducedMotion ? motion.div : "div";
  const motionProps = !prefersReducedMotion ? fadeInUp : {};

  return (
    <Wrapper
      {...motionProps}
      className={cn(
        "overflow-hidden rounded-2xl border border-brand-navy/10 bg-brand-navy/[0.04] p-3 shadow-brand-lg md:p-4",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full",
          variant === "preview"
            ? "aspect-[4/5] min-h-[18rem] sm:min-h-[22rem] lg:aspect-[3/4] lg:min-h-[26rem]"
            : "aspect-[3/4] min-h-[20rem] sm:min-h-[24rem] lg:min-h-[32rem]",
        )}
      >
        <Image
          src={PUBLIC_IMAGES.founder.introducingArtwork.src}
          alt={PUBLIC_IMAGES.founder.alt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes={sizes}
          className="object-contain object-center"
        />
      </div>
    </Wrapper>
  );
}
