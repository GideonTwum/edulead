"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import {
  HERO_SLIDESHOW_CONFIG,
  type HeroSlideImage,
} from "@/config/hero-images";

interface HeroBackgroundSlideshowProps {
  images: HeroSlideImage[];
  className?: string;
}

export function HeroBackgroundSlideshow({ images, className }: HeroBackgroundSlideshowProps) {
  const { prefersReducedMotion } = useMotionConfig();
  const [activeIndex, setActiveIndex] = useState(0);

  const { slideDurationMs, fadeDurationMs, kenBurnsScale } = HERO_SLIDESHOW_CONFIG;
  const slideDurationSec = slideDurationMs / 1000;
  const fadeDurationSec = fadeDurationMs / 1000;

  useEffect(() => {
    if (prefersReducedMotion || images.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, slideDurationMs);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, images.length, slideDurationMs]);

  if (images.length === 0) return null;

  const slides = prefersReducedMotion ? images.slice(0, 1) : images;

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {slides.map((image, index) => {
        const isActive = index === activeIndex;
        const isFirst = index === 0;

        return (
          <motion.div
            key={image.src}
            className="absolute inset-0 will-change-[opacity]"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: fadeDurationSec, ease: "easeInOut" }}
          >
            <motion.div
              className="relative h-full w-full will-change-transform"
              initial={false}
              animate={{
                scale: prefersReducedMotion || !isActive ? 1 : kenBurnsScale,
              }}
              transition={{
                duration: prefersReducedMotion || !isActive ? 0 : slideDurationSec,
                ease: "linear",
              }}
            >
              <Image
                src={image.src}
                alt=""
                fill
                priority={isFirst}
                loading={isFirst ? "eager" : "lazy"}
                sizes="100vw"
                className="object-cover md:object-cover"
                style={{ objectPosition: image.objectPosition ?? "center center" }}
              />
            </motion.div>
          </motion.div>
        );
      })}

      {/* Subtle grain above photos, below overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
