"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { EditorialImage } from "./EditorialImage";
import type { PublicImageRef } from "@/lib/public-images";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";

interface AudienceCardProps {
  title: string;
  image: PublicImageRef;
  icon: LucideIcon;
  reverse?: boolean;
}

export function AudienceCard({ title, image, icon: Icon, reverse = false }: AudienceCardProps) {
  const { fadeInUp, prefersReducedMotion } = useMotionConfig();

  return (
    <motion.article
      {...(prefersReducedMotion ? {} : fadeInUp)}
      className={cn(
        "group overflow-hidden rounded-brand-lg bg-white shadow-brand transition-shadow hover:shadow-brand-lg",
        reverse ? "lg:flex lg:flex-row-reverse" : "lg:flex",
      )}
    >
      <div className="relative aspect-[16/11] w-full shrink-0 lg:aspect-auto lg:w-2/5">
        <EditorialImage
          src={image.src}
          alt={image.alt}
          rounded="none"
          aspect="auto"
          className="absolute inset-0 h-full min-h-full"
          imageClassName="transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 240px"
          animate={false}
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
