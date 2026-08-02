"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { OpportunityCard } from "./OpportunityCard";
import { EmptyState } from "./EmptyState";
import type { Opportunity } from "@prisma/client";

const typeOptions = [
  { value: "", label: "All Types" },
  { value: "SCHOLARSHIP", label: "Scholarship" },
  { value: "FELLOWSHIP", label: "Fellowship" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "JOB", label: "Job" },
  { value: "CONFERENCE", label: "Conference" },
  { value: "COMPETITION", label: "Competition" },
  { value: "GRANT", label: "Grant" },
  { value: "TRAINING", label: "Training" },
  { value: "EXCHANGE_PROGRAMME", label: "Exchange Programme" },
  { value: "VOLUNTEER_OPPORTUNITY", label: "Volunteer" },
];

const locationOptions = [
  { value: "", label: "All Locations" },
  { value: "ON_SITE", label: "On-site" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "INTERNATIONAL", label: "International" },
];

interface OpportunityFiltersProps {
  opportunities: Opportunity[];
}

export function OpportunityFilters({ opportunities }: OpportunityFiltersProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [country, setCountry] = useState("");
  const [locationType, setLocationType] = useState("");

  const countries = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((o) => {
      if (o.country) set.add(o.country);
    });
    return Array.from(set).sort();
  }, [opportunities]);

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      if (type && o.opportunityType !== type) return false;
      if (country && o.country !== country) return false;
      if (locationType && o.locationType !== locationType) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          o.title.toLowerCase().includes(q) ||
          o.organisation.toLowerCase().includes(q) ||
          o.excerpt.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [opportunities, search, type, country, locationType]);

  const hasFilters = search || type || country || locationType;

  const clearFilters = () => {
    setSearch("");
    setType("");
    setCountry("");
    setLocationType("");
  };

  return (
    <div>
      <div className="mb-8 rounded-brand-lg bg-white p-6 shadow-brand">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search opportunities…"
              className="form-input pl-10"
              aria-label="Search opportunities"
            />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)} className="form-input" aria-label="Filter by type">
            {typeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="form-input"
            aria-label="Filter by country"
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
            className="form-input"
            aria-label="Filter by location type"
          >
            {locationOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {hasFilters && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type="button"
            onClick={clearFilters}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-navy hover:text-brand-green-dark"
          >
            <X className="h-4 w-4" /> Clear filters
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((o) => (
              <OpportunityCard key={o.id} opportunity={o} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState
              title="No opportunities found"
              description={
                hasFilters
                  ? "Try adjusting your filters or search terms."
                  : "We are curating leadership opportunities for young people. Check back soon."
              }
              action={
                hasFilters ? (
                  <button type="button" onClick={clearFilters} className="btn-secondary">
                    Clear filters
                  </button>
                ) : undefined
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length > 0 && (
        <p className="mt-6 text-center text-sm text-brand-grey">
          Showing {filtered.length} of {opportunities.length} opportunities
        </p>
      )}
    </div>
  );
}
