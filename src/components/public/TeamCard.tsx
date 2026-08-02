"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import type { TeamMember } from "@prisma/client";

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { staggerItem } = useMotionConfig();

  return (
    <>
      <motion.article
        {...staggerItem}
        className="group card-brand cursor-pointer text-center"
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setModalOpen(true)}
        aria-label={`View ${member.fullName}'s profile`}
      >
        <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full bg-brand-navy/5">
          {member.profileImage ? (
            <Image src={member.profileImage} alt={member.fullName} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center gradient-navy text-2xl font-bold text-brand-green">
              {member.fullName.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="font-display text-lg font-bold text-brand-navy">{member.fullName}</h3>
        <p className="mt-1 text-sm font-medium text-brand-green-dark">{member.role}</p>
        <p className="mt-3 text-sm text-brand-grey line-clamp-3">{member.biography}</p>
      </motion.article>

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-brand-navy/60 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-[90] max-h-[90vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-brand-lg bg-white p-8 shadow-brand-lg"
              role="dialog"
              aria-modal="true"
              aria-label={`${member.fullName} profile`}
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-2 hover:bg-brand-off-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center">
                <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                  {member.profileImage ? (
                    <Image src={member.profileImage} alt={member.fullName} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center gradient-navy text-xl font-bold text-brand-green">
                      {member.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-display text-xl font-bold text-brand-navy">{member.fullName}</h3>
                <p className="text-brand-green-dark">{member.role}</p>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-brand-grey">{member.biography}</p>

              <div className="mt-6 flex justify-center gap-3">
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-off-white text-brand-navy hover:bg-brand-navy hover:text-white"
                    aria-label="LinkedIn profile"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {member.showEmail && member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-off-white text-brand-navy hover:bg-brand-navy hover:text-white"
                    aria-label="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
