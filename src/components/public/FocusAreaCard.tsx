"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Landmark,
  Compass,
  MessageCircle,
  Scale,
  PenLine,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  landmark: Landmark,
  compass: Compass,
  "message-circle": MessageCircle,
  scale: Scale,
  "pen-line": PenLine,
};

interface FocusAreaCardProps {
  title: string;
  description: string;
  icon?: string;
  href?: string;
}

export function FocusAreaCard({ title, description, icon = "users", href }: FocusAreaCardProps) {
  const Icon = iconMap[icon] ?? Users;
  const { staggerItem } = useMotionConfig();

  const content = (
    <motion.div
      {...staggerItem}
      whileHover={{ y: -4 }}
      className="group card-brand h-full"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy text-brand-green transition-colors group-hover:bg-brand-green group-hover:text-brand-navy">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="font-display text-lg font-bold text-brand-navy">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-grey">{description}</p>
      {href && (
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-navy group-hover:text-brand-green-dark">
          Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      )}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
