"use client";

import { motion } from "framer-motion";
import { Mic, Users } from "lucide-react";
import { PUBLIC_IMAGES } from "@/lib/public-images";
import { EditorialImage } from "./EditorialImage";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import { cn } from "@/lib/utils";

export function HeroCollage({ className }: { className?: string }) {
  const { prefersReducedMotion, fadeInUp } = useMotionConfig();

  return (
    <div className={cn("relative mx-auto aspect-[4/5] max-w-md lg:max-w-none lg:aspect-square", className)}>
      <div className="absolute inset-0 rounded-[2rem] bg-brand-green/10 blur-3xl" aria-hidden="true" />

      <EditorialImage
        src={PUBLIC_IMAGES.hero.main.src}
        alt={PUBLIC_IMAGES.hero.main.alt}
        priority
        rounded="2xl"
        aspect="portrait"
        className="absolute left-0 top-8 z-10 w-[68%] shadow-brand-lg"
        sizes="(max-width: 1024px) 60vw, 320px"
      />

      <EditorialImage
        src={PUBLIC_IMAGES.hero.secondary.src}
        alt={PUBLIC_IMAGES.hero.secondary.alt}
        rounded="xl"
        aspect="square"
        className="absolute bottom-6 right-0 z-20 w-[48%] border-4 border-white/90 shadow-brand-lg"
        sizes="(max-width: 1024px) 40vw, 220px"
      />

      <motion.div
        {...(prefersReducedMotion ? {} : fadeInUp)}
        className="absolute left-[8%] top-[4%] z-30 max-w-[9rem] rounded-2xl border border-white/20 bg-white/95 p-3 shadow-brand-lg backdrop-blur"
      >
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/20 text-brand-navy">
          <Users className="h-4 w-4" aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold text-brand-navy">Mentorship pathways</p>
        <p className="mt-1 text-[11px] leading-snug text-brand-grey">Guidance from experienced leaders</p>
      </motion.div>

      <motion.div
        {...(prefersReducedMotion ? {} : { ...fadeInUp, transition: { delay: 0.12 } })}
        className="absolute bottom-[18%] right-[6%] z-30 max-w-[9rem] rounded-2xl border border-white/20 bg-brand-navy/90 p-3 shadow-brand-lg backdrop-blur"
      >
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/20 text-brand-green">
          <Mic className="h-4 w-4" aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold text-white">Policy dialogue</p>
        <p className="mt-1 text-[11px] leading-snug text-white/75">Youth voices in governance</p>
      </motion.div>
    </div>
  );
}
