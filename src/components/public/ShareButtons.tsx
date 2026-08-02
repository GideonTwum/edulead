"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Check, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

export function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: Linkedin,
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Twitter,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span className="text-sm font-medium text-brand-grey">Share:</span>
      {shareLinks.map(({ label, href, icon: Icon }) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-off-white text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
        </motion.a>
      ))}
      <motion.button
        type="button"
        onClick={copyLink}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-9 items-center gap-2 rounded-full bg-brand-off-white px-3 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
        aria-label="Copy link"
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        {copied ? "Copied" : "Copy link"}
      </motion.button>
    </div>
  );
}
