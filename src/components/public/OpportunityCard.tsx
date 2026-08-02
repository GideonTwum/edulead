"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, MapPin, Clock } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { formatDate, isDeadlinePassed, cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import type { Opportunity } from "@prisma/client";

const typeLabels: Record<string, string> = {
  SCHOLARSHIP: "Scholarship",
  FELLOWSHIP: "Fellowship",
  INTERNSHIP: "Internship",
  JOB: "Job",
  CONFERENCE: "Conference",
  COMPETITION: "Competition",
  GRANT: "Grant",
  TRAINING: "Training",
  EXCHANGE_PROGRAMME: "Exchange Programme",
  VOLUNTEER_OPPORTUNITY: "Volunteer",
};

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const { staggerItem } = useMotionConfig();
  const expired = isDeadlinePassed(opportunity.deadline);

  return (
    <motion.article {...staggerItem} className={cn("group card-brand", expired && "opacity-70")}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-navy px-3 py-1 text-xs font-semibold text-brand-green">
          {typeLabels[opportunity.opportunityType] ?? opportunity.opportunityType}
        </span>
        {expired && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">Expired</span>
        )}
      </div>

      <h3 className="font-display text-lg font-bold text-brand-navy">{opportunity.title}</h3>
      <p className="mt-1 text-sm text-brand-grey">{opportunity.organisation}</p>
      <p className="mt-2 text-sm leading-relaxed text-brand-grey line-clamp-2">{opportunity.excerpt}</p>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-brand-grey">
        {opportunity.country && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {opportunity.country}
          </span>
        )}
        {opportunity.deadline && (
          <span className={cn("flex items-center gap-1", expired && "text-red-600")}>
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {expired ? "Deadline passed" : `Deadline: ${formatDate(opportunity.deadline)}`}
          </span>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href={ROUTES.opportunity(opportunity.slug)} className="btn-secondary !px-4 !py-2 text-xs">
          View Details
        </Link>
        {opportunity.applicationUrl && !expired && (
          <a
            href={opportunity.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy hover:text-brand-green-dark"
          >
            Apply <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </motion.article>
  );
}
