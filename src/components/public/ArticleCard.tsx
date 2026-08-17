"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { useMotionConfig } from "@/hooks/useMotionConfig";
import type { Article } from "@prisma/client";

interface ArticleCardProps {
  article: Article & { category?: { name: string } | null };
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { staggerItem } = useMotionConfig();

  return (
    <motion.article {...staggerItem} className="group card-brand overflow-hidden !p-0">
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-navy/5">
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center gradient-navy">
            <span className="font-display text-xl font-bold text-brand-green">Publications</span>
          </div>
        )}
        {(article.categoryLabel || article.category?.name) && (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-navy backdrop-blur">
            {article.categoryLabel ?? article.category?.name}
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 text-xs text-brand-grey">
          {article.publishedAt && (
            <time dateTime={article.publishedAt.toISOString()}>{formatDate(article.publishedAt)}</time>
          )}
          {article.readingTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {article.readingTime} min read
            </span>
          )}
        </div>
        <h3 className="mt-2 font-display text-lg font-bold text-brand-navy group-hover:text-brand-green-dark">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-brand-grey line-clamp-2">{article.excerpt}</p>
        <Link
          href={ROUTES.publication(article.slug)}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-navy group-hover:text-brand-green-dark"
        >
          Read publication <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}
