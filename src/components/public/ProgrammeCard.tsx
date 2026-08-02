"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import type { Programme } from "@prisma/client";

const statusColors: Record<string, string> = {
  PLANNED: "bg-brand-grey/10 text-brand-grey",
  COMING_SOON: "bg-amber-100 text-amber-800",
  OPEN: "bg-green-100 text-green-800",
  ONGOING: "bg-blue-100 text-blue-800",
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

interface ProgrammeCardProps {
  programme: Programme;
}

export function ProgrammeCard({ programme }: ProgrammeCardProps) {
  const { staggerItem } = useMotionConfig();

  return (
    <motion.article {...staggerItem} className="group card-brand flex h-full flex-col overflow-hidden !p-0">
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-navy/5">
        {programme.featuredImage ? (
          <Image
            src={programme.featuredImage}
            alt={programme.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center gradient-navy">
            <span className="font-display text-2xl font-bold text-brand-green">EduLead</span>
          </div>
        )}
        <span
          className={cn(
            "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold",
            statusColors[programme.status] ?? statusColors.PLANNED,
          )}
        >
          {statusLabels[programme.status] ?? programme.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold text-brand-navy">{programme.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-grey line-clamp-3">
          {programme.excerpt}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-brand-grey">
          {programme.format && <span className="rounded-full bg-brand-off-white px-2 py-1">{programme.format}</span>}
          {programme.targetAudience && (
            <span className="rounded-full bg-brand-off-white px-2 py-1">{programme.targetAudience}</span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={ROUTES.programme(programme.slug)} className="btn-secondary !px-4 !py-2 text-xs">
            Learn More
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
    </motion.article>
  );
}
