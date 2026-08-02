"use client";

import { useReducedMotion } from "framer-motion";

export function useMotionConfig() {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion: prefersReducedMotion ?? false,
    fadeInUp: prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-50px" },
          transition: { duration: 0.5, ease: "easeOut" as const },
        },
    staggerContainer: prefersReducedMotion
      ? {}
      : {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, margin: "-50px" },
          variants: {
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          },
        },
    staggerItem: prefersReducedMotion
      ? {}
      : {
          variants: {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
          },
        },
    pageTransition: prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.3 },
        },
  };
}
