"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, UserPlus, Heart, Handshake, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";

const iconMap = {
  YOUNG_PERSON: Sparkles,
  MENTOR: Users,
  VOLUNTEER: Handshake,
  PARTNER: UserPlus,
  SUPPORTER: Heart,
};

interface JoinPathCardProps {
  title: string;
  description: string;
  href: string;
  type: keyof typeof iconMap;
}

export function JoinPathCard({ title, description, href, type }: JoinPathCardProps) {
  const Icon = iconMap[type];
  const { staggerItem } = useMotionConfig();

  return (
    <motion.div {...staggerItem}>
      <Link
        href={href}
        className="group flex h-full flex-col rounded-brand-lg border border-brand-border bg-white p-6 shadow-brand transition-all hover:border-brand-green hover:shadow-brand-lg"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy text-brand-green transition-colors group-hover:bg-brand-green group-hover:text-brand-navy">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="font-display text-lg font-bold text-brand-navy">{title}</h3>
        <p className="mt-2 flex-1 text-sm text-brand-grey">{description}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-navy group-hover:text-brand-green-dark">
          Get started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </motion.div>
  );
}
