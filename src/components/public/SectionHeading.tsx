"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  light = false,
}: SectionHeadingProps) {
  const { fadeInUp } = useMotionConfig();

  return (
    <motion.div
      {...fadeInUp}
      className={cn(
        "mb-12 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "mb-3 inline-block text-sm font-semibold uppercase tracking-wider",
            light ? "text-brand-green" : "text-brand-green-dark",
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl",
          light ? "text-white" : "text-brand-navy",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            light ? "text-white/80" : "text-brand-grey",
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
