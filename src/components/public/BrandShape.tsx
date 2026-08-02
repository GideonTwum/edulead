"use client";

import { cn } from "@/lib/utils";

interface BrandShapeProps {
  variant?: "circle" | "stroke" | "dots" | "gradient";
  className?: string;
}

export function BrandShape({ variant = "circle", className }: BrandShapeProps) {
  if (variant === "circle") {
    return (
      <div
        className={cn("pointer-events-none absolute rounded-full bg-brand-green/20 blur-3xl", className)}
        aria-hidden="true"
      />
    );
  }

  if (variant === "stroke") {
    return (
      <svg
        className={cn("pointer-events-none absolute text-brand-green/30", className)}
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 100 Q100 20 180 100 Q100 180 20 100"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    );
  }

  if (variant === "dots") {
    return (
      <div
        className={cn("pointer-events-none absolute dot-grid opacity-40", className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute bg-gradient-to-br from-brand-green/20 to-transparent",
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function SectionDivider() {
  return (
    <div className="relative h-16 overflow-hidden" aria-hidden="true">
      <svg viewBox="0 0 1440 64" fill="none" className="absolute bottom-0 w-full" preserveAspectRatio="none">
        <path d="M0 64V32C240 0 480 0 720 32C960 64 1200 64 1440 32V64H0Z" fill="var(--brand-off-white)" />
      </svg>
    </div>
  );
}

export function CurvedDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className={cn("relative h-12", flip && "rotate-180")} aria-hidden="true">
      <svg viewBox="0 0 1440 48" className="w-full" preserveAspectRatio="none">
        <path
          d="M0 48V24C360 0 720 0 1080 24C1260 36 1380 42 1440 48H0Z"
          fill="currentColor"
          className="text-brand-off-white"
        />
      </svg>
    </div>
  );
}
