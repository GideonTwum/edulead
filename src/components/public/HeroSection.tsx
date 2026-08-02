"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, BookOpen, Mic, Globe, TrendingUp } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { BrandShape } from "./BrandShape";
import { useMotionConfig } from "@/hooks/useMotionConfig";

interface HeroSectionProps {
  headline?: string;
  subtext?: string;
}

export function HeroSection({
  headline = "Preparing Young Leaders to Shape Policy, Governance and Society.",
  subtext = "EduLead Network bridges the gap between education and leadership by equipping young people with mentorship, policy exposure, career guidance and the confidence to lead.",
}: HeroSectionProps) {
  const { fadeInUp, prefersReducedMotion } = useMotionConfig();

  return (
    <section className="relative overflow-hidden gradient-navy pb-20 pt-8 md:pb-28 md:pt-12">
      <BrandShape variant="circle" className="right-0 top-0 h-96 w-96" />
      <BrandShape variant="circle" className="bottom-0 left-0 h-64 w-64 bg-brand-green/10" />
      <BrandShape variant="dots" className="inset-0 opacity-20" />

      <div className="container-brand relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.span
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-block rounded-full bg-brand-green/20 px-4 py-1.5 text-sm font-semibold text-brand-green"
            >
              Education for Leadership and Change
            </motion.span>

            <motion.h1
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
            >
              {headline}
            </motion.h1>

            <motion.p
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg leading-relaxed text-white/80 md:text-xl"
            >
              {subtext}
            </motion.p>

            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link href={ROUTES.join} className="btn-primary">
                Join the Movement
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="#focus-areas" className="btn-white">
                Explore Our Focus Areas
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
            aria-hidden="true"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-full bg-brand-green/10 blur-2xl" />
              <div className="relative grid grid-cols-2 gap-4 p-8">
                {[
                  { icon: Users, label: "Mentorship", color: "bg-brand-green text-brand-navy" },
                  { icon: BookOpen, label: "Education", color: "bg-white/10 text-brand-green" },
                  { icon: Mic, label: "Policy Dialogue", color: "bg-white/10 text-brand-green" },
                  { icon: Globe, label: "Networks", color: "bg-brand-green text-brand-navy" },
                  { icon: TrendingUp, label: "Leadership", color: "bg-white/10 text-brand-green", colSpan: true },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    {...fadeInUp}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className={`flex flex-col items-center justify-center rounded-2xl p-6 backdrop-blur ${item.color} ${"colSpan" in item && item.colSpan ? "col-span-2" : ""}`}
                  >
                    <item.icon className="mb-2 h-8 w-8" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
