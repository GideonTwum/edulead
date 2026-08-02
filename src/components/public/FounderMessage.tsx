"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Linkedin, Quote } from "lucide-react";
import { useMotionConfig } from "@/hooks/useMotionConfig";

interface FounderMessageProps {
  name: string;
  title: string;
  message: string;
  photoUrl?: string | null;
  linkedinUrl?: string | null;
  signature?: string | null;
}

export function FounderMessage({
  name,
  title,
  message,
  photoUrl,
  linkedinUrl,
  signature,
}: FounderMessageProps) {
  const { fadeInUp } = useMotionConfig();

  return (
    <motion.section {...fadeInUp} className="relative overflow-hidden rounded-brand-lg gradient-navy p-8 md:p-12 lg:p-16">
      <Quote className="absolute right-8 top-8 h-24 w-24 text-brand-green/10" aria-hidden="true" />

      <div className="relative grid gap-8 lg:grid-cols-[200px_1fr] lg:gap-12">
        <div className="mx-auto lg:mx-0">
          <div className="relative h-40 w-40 overflow-hidden rounded-2xl ring-4 ring-brand-green/30 lg:h-48 lg:w-48">
            {photoUrl ? (
              <Image src={photoUrl} alt={`${name}, ${title}`} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-brand-navy-dark text-4xl font-bold text-brand-green">
                {name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div>
          <Quote className="mb-4 h-8 w-8 text-brand-green" aria-hidden="true" />
          <blockquote className="text-lg leading-relaxed text-white/90 md:text-xl">
            {message}
          </blockquote>

          <footer className="mt-8">
            <cite className="not-italic">
              <p className="font-display text-xl font-bold text-white">{name}</p>
              <p className="text-brand-green">{title}</p>
              {signature && <p className="mt-2 font-serif text-white/70 italic">{signature}</p>}
            </cite>

            {linkedinUrl && (
              <Link
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-brand-green hover:text-white"
              >
                <Linkedin className="h-4 w-4" /> Connect on LinkedIn
              </Link>
            )}
          </footer>
        </div>
      </div>
    </motion.section>
  );
}
