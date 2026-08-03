"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import { motion } from "framer-motion";

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  rounded?: "lg" | "xl" | "2xl" | "full" | "none";
  aspect?: "square" | "video" | "portrait" | "wide" | "auto";
  animate?: boolean;
}

const aspectClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/10]",
  auto: "min-h-[12rem]",
};

const roundedClasses = {
  lg: "rounded-brand-lg",
  xl: "rounded-2xl",
  "2xl": "rounded-3xl",
  full: "rounded-full",
  none: "rounded-none",
};

export function EditorialImage({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  rounded = "xl",
  aspect = "wide",
  animate = true,
}: EditorialImageProps) {
  const { prefersReducedMotion, fadeInUp } = useMotionConfig();
  const Wrapper = animate && !prefersReducedMotion ? motion.div : "div";
  const motionProps =
    animate && !prefersReducedMotion
      ? { ...fadeInUp, whileHover: { scale: 1.02 }, transition: { duration: 0.35 } }
      : {};

  return (
    <Wrapper
      {...motionProps}
      className={cn(
        "relative overflow-hidden bg-brand-navy/5 shadow-brand",
        aspectClasses[aspect],
        roundedClasses[rounded],
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover object-center", imageClassName)}
      />
    </Wrapper>
  );
}
