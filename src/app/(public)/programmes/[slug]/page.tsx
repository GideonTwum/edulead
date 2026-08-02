import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { RichTextRenderer } from "@/components/public/RichTextRenderer";
import { ProgrammeInterestForm } from "@/components/public/ProgrammeInterestForm";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ROUTES } from "@/lib/constants";
import { getProgrammeBySlug } from "@/lib/data/content";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const programme = await getProgrammeBySlug(slug);
  if (!programme) return { title: "Programme Not Found" };

  return {
    title: programme.seoTitle ?? programme.title,
    description: programme.seoDescription ?? programme.excerpt,
  };
}

const statusLabels: Record<string, string> = {
  PLANNED: "Planned",
  COMING_SOON: "Coming Soon",
  OPEN: "Open for Applications",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
};

export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params;
  const programme = await getProgrammeBySlug(slug);
  if (!programme) notFound();

  const detailSections = [
    { label: "Objectives", content: programme.objectives },
    { label: "Who Is It For", content: programme.whoIsItFor },
    { label: "What to Expect", content: programme.expectations },
    { label: "Timeline", content: programme.timeline },
  ].filter((s) => s.content);

  return (
    <>
      <HeroSection headline={programme.title} subtext={programme.excerpt} />

      <section className="section-padding">
        <div className="container-brand">
          <Breadcrumbs
            items={[
              { label: "Programmes", href: ROUTES.programmes },
              { label: programme.title },
            ]}
          />

          <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
            <div>
              {programme.featuredImage && (
                <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-brand-lg">
                  <Image
                    src={programme.featuredImage}
                    alt={programme.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="mb-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-brand-navy px-3 py-1 text-xs font-semibold text-brand-green">
                  {statusLabels[programme.status] ?? programme.status}
                </span>
                {programme.format && (
                  <span className="rounded-full bg-brand-off-white px-3 py-1 text-xs font-medium text-brand-grey">
                    {programme.format}
                  </span>
                )}
              </div>

              <RichTextRenderer content={programme.description} />

              {detailSections.map((section) => (
                <div key={section.label} className="mt-10">
                  <h2 className="font-display text-2xl font-bold text-brand-navy">{section.label}</h2>
                  <RichTextRenderer content={section.content!} className="mt-4" />
                </div>
              ))}

              {programme.externalApplicationUrl && programme.status === "OPEN" && (
                <div className="mt-10">
                  <a
                    href={programme.externalApplicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Apply Now <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-brand-lg bg-white p-6 shadow-brand">
                <h3 className="font-display text-lg font-bold text-brand-navy">Programme Details</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  {programme.targetAudience && (
                    <div className="flex gap-3">
                      <Users className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-dark" aria-hidden="true" />
                      <div>
                        <dt className="font-medium text-brand-navy">Target Audience</dt>
                        <dd className="text-brand-grey">{programme.targetAudience}</dd>
                      </div>
                    </div>
                  )}
                  {programme.location && (
                    <div className="flex gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-dark" aria-hidden="true" />
                      <div>
                        <dt className="font-medium text-brand-navy">Location</dt>
                        <dd className="text-brand-grey">{programme.location}</dd>
                      </div>
                    </div>
                  )}
                  {programme.startDate && (
                    <div className="flex gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-dark" aria-hidden="true" />
                      <div>
                        <dt className="font-medium text-brand-navy">Dates</dt>
                        <dd className="text-brand-grey">
                          {formatDate(programme.startDate)}
                          {programme.endDate && ` — ${formatDate(programme.endDate)}`}
                        </dd>
                      </div>
                    </div>
                  )}
                  {programme.applicationDeadline && (
                    <div className="flex gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-dark" aria-hidden="true" />
                      <div>
                        <dt className="font-medium text-brand-navy">Application Deadline</dt>
                        <dd className="text-brand-grey">{formatDate(programme.applicationDeadline)}</dd>
                      </div>
                    </div>
                  )}
                </dl>
              </div>

              {programme.interestFormEnabled && (
                <div id="express-interest">
                  <ProgrammeInterestForm programmeId={programme.id} programmeTitle={programme.title} />
                </div>
              )}
            </aside>
          </div>

          <div className="mt-12 text-center">
            <Link href={ROUTES.programmes} className="btn-secondary">
              ← Back to Programmes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
