import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin, Clock, AlertTriangle } from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { RichTextRenderer } from "@/components/public/RichTextRenderer";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ROUTES } from "@/lib/constants";
import { getOpportunityBySlug } from "@/lib/data/content";
import { formatDate, isDeadlinePassed } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

const typeLabels: Record<string, string> = {
  SCHOLARSHIP: "Scholarship",
  FELLOWSHIP: "Fellowship",
  INTERNSHIP: "Internship",
  JOB: "Job",
  CONFERENCE: "Conference",
  COMPETITION: "Competition",
  GRANT: "Grant",
  TRAINING: "Training",
  EXCHANGE_PROGRAMME: "Exchange Programme",
  VOLUNTEER_OPPORTUNITY: "Volunteer Opportunity",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = await getOpportunityBySlug(slug);
  if (!opportunity) return { title: "Opportunity Not Found" };

  return {
    title: opportunity.seoTitle ?? opportunity.title,
    description: opportunity.seoDescription ?? opportunity.excerpt,
  };
}

export default async function OpportunityDetailPage({ params }: Props) {
  const { slug } = await params;
  const opportunity = await getOpportunityBySlug(slug);
  if (!opportunity) notFound();

  const expired = isDeadlinePassed(opportunity.deadline);

  return (
    <>
      <HeroSection headline={opportunity.title} subtext={opportunity.excerpt} />

      <section className="section-padding">
        <div className="container-brand max-w-4xl">
          <Breadcrumbs
            items={[
              { label: "Opportunities", href: ROUTES.opportunities },
              { label: opportunity.title },
            ]}
          />

          <div className="mb-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-navy px-3 py-1 text-xs font-semibold text-brand-green">
              {typeLabels[opportunity.opportunityType] ?? opportunity.opportunityType}
            </span>
            {expired && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                Deadline Passed
              </span>
            )}
          </div>

          <p className="text-lg font-medium text-brand-navy">{opportunity.organisation}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-brand-grey">
            {opportunity.country && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {opportunity.country}
              </span>
            )}
            {opportunity.deadline && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Deadline: {formatDate(opportunity.deadline)}
              </span>
            )}
          </div>

          <div className="mt-8">
            <RichTextRenderer content={opportunity.description} />
          </div>

          {opportunity.eligibility && (
            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold text-brand-navy">Eligibility</h2>
              <RichTextRenderer content={opportunity.eligibility} className="mt-4" />
            </div>
          )}

          {opportunity.applicationUrl && !expired && (
            <div className="mt-10">
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Apply on Official Site <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          <div className="mt-12 rounded-brand-lg border border-amber-200 bg-amber-50 p-6">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
              <div>
                <h3 className="font-display font-bold text-brand-navy">Disclaimer</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-grey">
                  EduLead Network curates this opportunity for informational purposes. We are not the
                  administering organisation and cannot guarantee the accuracy of all details. Always
                  verify eligibility, deadlines, and application requirements on the official website
                  before applying. EduLead Network is not responsible for third-party application
                  processes or outcomes.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href={ROUTES.opportunities} className="btn-secondary">
              ← Back to Opportunities
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
