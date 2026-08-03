"use client";

import { motion } from "framer-motion";
import { EditorialImage } from "./EditorialImage";
import type { PublicImageRef } from "@/lib/public-images";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import { cn } from "@/lib/utils";

interface ImageStackProps {
  images: PublicImageRef[];
  className?: string;
}

export function ImageStack({ images, className }: ImageStackProps) {
  const { prefersReducedMotion, staggerItem } = useMotionConfig();

  return (
    <div className={cn("relative min-h-[18rem]", className)}>
      {images.slice(0, 3).map((image, index) => (
        <motion.div
          key={image.src}
          {...(prefersReducedMotion ? {} : { ...staggerItem, transition: { delay: index * 0.08 } })}
          className={cn(
            "absolute w-[58%] shadow-brand-lg",
            index === 0 && "left-0 top-0 z-10",
            index === 1 && "right-0 top-10 z-20",
            index === 2 && "bottom-0 left-[18%] z-30 w-[52%]",
          )}
        >
          <EditorialImage
            src={image.src}
            alt={image.alt}
            rounded="xl"
            aspect={index === 1 ? "square" : "wide"}
            animate={false}
            sizes="240px"
          />
        </motion.div>
      ))}
    </div>
  );
}
