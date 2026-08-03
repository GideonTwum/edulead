"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import { getProgrammePlaceholder, resolveImageSrc } from "@/lib/public-images";
import type { Programme } from "@prisma/client";

const statusColors: Record<string, string> = {
  PLANNED: "bg-brand-navy/90 text-white ring-1 ring-white/20",
  COMING_SOON: "bg-amber-500 text-white",
  OPEN: "bg-green-600 text-white",
  ONGOING: "bg-blue-600 text-white",
  COMPLETED: "bg-brand-navy/10 text-brand-navy",
  ARCHIVED: "bg-gray-100 text-gray-600",
};

const statusLabels: Record<string, string> = {
  PLANNED: "Planned",
  COMING_SOON: "Coming Soon",
  OPEN: "Open",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

const categoryLabels: Record<string, string> = {
  MENTORSHIP_COACHING: "Mentorship",
  POLICY_LEADERSHIP_TRAINING: "Policy Leadership",
  CAREER_DEVELOPMENT: "Career Development",
  YOUTH_POLICY_DIALOGUE: "Youth Dialogue",
  CIVIC_LEADERSHIP: "Civic Leadership",
  COMMUNICATION_RESEARCH: "Communication & Research",
};

interface ProgrammeCardProps {
  programme: Programme;
  layout?: "default" | "featured" | "featured-reverse";
}

function ProgrammeImage({
  programme,
  className,
  priority = false,
}: {
  programme: Programme;
  className?: string;
  priority?: boolean;
}) {
  const image = resolveImageSrc(programme.featuredImage, getProgrammePlaceholder(programme.category));

  return (
    <div className={cn("relative overflow-hidden bg-brand-navy/5", className)}>
      <Image
        src={image.src}
        alt={programme.featuredImage ? programme.title : image.alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 via-transparent to-transparent" />
      <span
        className={cn(
          "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
          statusColors[programme.status] ?? statusColors.PLANNED,
        )}
      >
        {statusLabels[programme.status] ?? programme.status}
      </span>
      {programme.category ? (
        <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-navy shadow-sm">
          {categoryLabels[programme.category] ?? programme.category}
        </span>
      ) : null}
    </div>
  );
}

function ProgrammeCardBody({ programme }: { programme: Programme }) {
  return (
    <div className="flex flex-1 flex-col p-6">
      <h3 className="font-display text-xl font-bold text-brand-navy">{programme.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-grey line-clamp-3">{programme.excerpt}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-brand-grey">
        {programme.format && <span className="rounded-full bg-brand-off-white px-2 py-1">{programme.format}</span>}
        {programme.targetAudience && (
          <span className="rounded-full bg-brand-off-white px-2 py-1">{programme.targetAudience}</span>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={ROUTES.programme(programme.slug)} className="btn-secondary !px-4 !py-2 text-xs">
          Learn More
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
        {programme.interestFormEnabled && (
          <Link
            href={`${ROUTES.programme(programme.slug)}#express-interest`}
            className="btn-primary !px-4 !py-2 text-xs"
          >
            Express Interest
          </Link>
        )}
      </div>
    </div>
  );
}

export function ProgrammeCard({ programme, layout = "default" }: ProgrammeCardProps) {
  const { fadeInUp, prefersReducedMotion } = useMotionConfig();

  if (layout === "featured" || layout === "featured-reverse") {
    const reverse = layout === "featured-reverse";

    return (
      <motion.article
        {...(prefersReducedMotion ? {} : fadeInUp)}
        className={cn(
          "group card-brand flex h-full flex-col overflow-hidden !p-0 lg:flex-row",
          reverse && "lg:flex-row-reverse",
        )}
      >
        <ProgrammeImage programme={programme} className="aspect-[16/10] lg:aspect-auto lg:w-1/2 lg:min-h-[18rem]" />
        <ProgrammeCardBody programme={programme} />
      </motion.article>
    );
  }

  return (
    <motion.article
      {...(prefersReducedMotion ? {} : fadeInUp)}
      className="group card-brand flex h-full flex-col overflow-hidden !p-0"
    >
      <ProgrammeImage programme={programme} className="aspect-[16/10]" />
      <ProgrammeCardBody programme={programme} />
    </motion.article>
  );
}
