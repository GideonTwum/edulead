"use client";

import { motion } from "framer-motion";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-brand-lg border border-dashed border-brand-border bg-white p-12 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-off-white">
        <Inbox className="h-8 w-8 text-brand-grey" aria-hidden="true" />
      </div>
      <h3 className="font-display text-xl font-bold text-brand-navy">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-brand-grey">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
