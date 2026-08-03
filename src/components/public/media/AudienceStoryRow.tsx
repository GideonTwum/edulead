"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import type { AudienceGroup } from "@/config/audience-groups";

interface AudienceStoryRowProps {
  group: AudienceGroup;
  reverse?: boolean;
}

export function AudienceStoryRow({ group, reverse = false }: AudienceStoryRowProps) {
  const { fadeInUp, prefersReducedMotion } = useMotionConfig();
  const { title, icon: Icon, image, imageAlt, imagePosition } = group;

  return (
    <motion.article
      {...(prefersReducedMotion ? {} : fadeInUp)}
      className={cn(
        "group overflow-hidden rounded-brand-lg bg-white shadow-brand transition-shadow hover:shadow-brand-lg",
        reverse ? "lg:flex lg:flex-row-reverse" : "lg:flex",
      )}
    >
      <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden lg:aspect-auto lg:w-2/5">
        <Image
          src={image}
          alt={imageAlt}
          fill
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 240px"
          className={cn(
            "object-cover",
            !prefersReducedMotion && "transition-transform duration-700 ease-out group-hover:scale-[1.03]",
          )}
          style={{ objectPosition: imagePosition }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/45 via-brand-navy/15 to-brand-navy/5"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-green/10 blur-2xl"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 items-center gap-4 p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-brand-green">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium leading-relaxed text-brand-text md:text-base">{title}</p>
      </div>
    </motion.article>
  );
}

/** @deprecated Use AudienceStoryRow */
export const AudienceCard = AudienceStoryRow;
