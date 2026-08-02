"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArticleCard } from "@/components/public/ArticleCard";
import { EmptyState } from "@/components/public/EmptyState";
import type { Article, ArticleCategory } from "@prisma/client";

type ArticleWithCategory = Article & { category?: ArticleCategory | null };

interface InsightsListingProps {
  articles: ArticleWithCategory[];
}

export function InsightsListing({ articles }: InsightsListingProps) {
  const [category, setCategory] = useState("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      const label = a.categoryLabel ?? a.category?.name;
      if (label) set.add(label);
    });
    return Array.from(set).sort();
  }, [articles]);

  const filtered = useMemo(() => {
    if (!category) return articles;
    return articles.filter((a) => (a.categoryLabel ?? a.category?.name) === category);
  }, [articles, category]);

  return (
    <div>
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              !category ? "bg-brand-navy text-white" : "bg-brand-off-white text-brand-grey hover:bg-brand-navy/10"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                category === cat
                  ? "bg-brand-navy text-white"
                  : "bg-brand-off-white text-brand-grey hover:bg-brand-navy/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <motion.div
            key={category || "all"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState
              title="No articles yet"
              description={
                category
                  ? "No articles in this category yet. Check back soon."
                  : "We will share leadership resources, policy perspectives, and career guidance articles here."
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
