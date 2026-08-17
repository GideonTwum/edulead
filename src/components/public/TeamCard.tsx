"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Linkedin } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import type { TeamMember } from "@prisma/client";

const PORTRAIT_POSITION: Record<string, string> = {
  "elizabeth-dansoa-osei": "object-[center_15%]",
  "stephen-awuah-pobi": "object-[center_20%]",
  "linda-ackah-mensah": "object-[center_18%]",
  "christabel-gyebuaa-mensah": "object-[center_12%]",
  "hollandswell-donkor": "object-[center_20%]",
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  const { staggerItem } = useMotionConfig();
  const intro = stripHtml(member.biography).slice(0, 160);
  const imagePosition = PORTRAIT_POSITION[member.slug] ?? "object-center";

  return (
    <motion.article {...staggerItem} className="card-brand flex h-full flex-col overflow-hidden !p-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-navy/5">
        {member.profileImage ? (
          <Image
            src={member.profileImage}
            alt={`${member.fullName}${member.role ? `, ${member.role}` : ""} of EduLead Network`}
            fill
            className={`object-cover ${imagePosition}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center gradient-navy text-4xl font-bold text-brand-green">
            {member.fullName.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold text-brand-navy">{member.fullName}</h3>
        {member.role ? (
          <p className="mt-1 text-sm font-semibold text-brand-green-dark">{member.role}</p>
        ) : null}
        <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-grey line-clamp-4">
          {intro}
          {intro.length >= 160 ? "…" : ""}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <Link
            href={ROUTES.teamMember(member.slug)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-navy hover:text-brand-green-dark"
          >
            Read bio <ArrowRight className="h-4 w-4" />
          </Link>
          {member.linkedinUrl ? (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-off-white text-brand-navy hover:bg-brand-navy hover:text-white"
              aria-label={`${member.fullName} on LinkedIn`}
              onClick={(e) => e.stopPropagation()}
            >
              <Linkedin className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
