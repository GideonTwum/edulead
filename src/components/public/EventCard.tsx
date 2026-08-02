"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import type { Event } from "@prisma/client";

const typeLabels: Record<string, string> = {
  WORKSHOP: "Workshop",
  WEBINAR: "Webinar",
  POLICY_DIALOGUE: "Policy Dialogue",
  SEMINAR: "Seminar",
  CONFERENCE: "Conference",
  NETWORKING_SESSION: "Networking",
  MENTORSHIP_SESSION: "Mentorship",
  TRAINING: "Training",
};

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { staggerItem } = useMotionConfig();

  return (
    <motion.article {...staggerItem} className="group card-brand overflow-hidden !p-0">
      <div className="relative aspect-[16/9] overflow-hidden bg-brand-navy/5">
        {event.featuredImage ? (
          <Image
            src={event.featuredImage}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center gradient-navy">
            <Calendar className="h-12 w-12 text-brand-green" aria-hidden="true" />
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-brand-green px-3 py-1 text-xs font-semibold text-brand-navy">
          {typeLabels[event.eventType] ?? event.eventType}
        </span>
      </div>

      <div className="p-6">
        <time className="text-sm font-semibold text-brand-green-dark" dateTime={event.date.toISOString()}>
          {formatDate(event.date)}
          {event.startTime && ` · ${event.startTime}`}
        </time>
        <h3 className="mt-2 font-display text-lg font-bold text-brand-navy">{event.title}</h3>
        <p className="mt-2 text-sm text-brand-grey line-clamp-2">{event.excerpt}</p>
        {event.venue && (
          <p className="mt-3 flex items-center gap-1 text-xs text-brand-grey">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {event.venue}
          </p>
        )}
        <Link href={ROUTES.event(event.slug)} className="btn-secondary mt-4 !px-4 !py-2 text-xs">
          View Event
        </Link>
      </div>
    </motion.article>
  );
}
