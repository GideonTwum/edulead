"use client";

import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditorialImage } from "./media/EditorialImage";
import type { PublicImageRef } from "@/lib/public-images";
import { useMotionConfig } from "@/hooks/useMotionConfig";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
  image?: PublicImageRef;
}

export function EmptyState({ title, description, action, className, image }: EmptyStateProps) {
  const { prefersReducedMotion } = useMotionConfig();

  if (image) {
    return (
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("relative overflow-hidden rounded-brand-lg shadow-brand", className)}
      >
        <EditorialImage
          src={image.src}
          alt={image.alt}
          rounded="lg"
          aspect="wide"
          className="min-h-[14rem]"
          animate={false}
          sizes="(max-width: 768px) 100vw, 800px"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-navy/75 p-8 text-center backdrop-blur-[1px]">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <Inbox className="h-7 w-7 text-brand-green" aria-hidden="true" />
          </div>
          <h3 className="font-display text-xl font-bold text-white md:text-2xl">{title}</h3>
          <p className="mt-2 max-w-md text-sm text-white/80">{description}</p>
          {action ? <div className="mt-6">{action}</div> : null}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-brand-lg border border-dashed border-brand-border bg-white p-12 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-off-white">
        <Inbox className="h-8 w-8 text-brand-grey" aria-hidden="true" />
      </div>
      <h3 className="font-display text-xl font-bold text-brand-navy">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-brand-grey">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </motion.div>
  );
}
