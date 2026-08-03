import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";
import { RichTextRenderer } from "@/components/public/RichTextRenderer";
import { ProgrammeInterestForm } from "@/components/public/ProgrammeInterestForm";
import { ProgrammeCard } from "@/components/public/ProgrammeCard";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { SectionHeading } from "@/components/public/SectionHeading";
import { EditorialImage } from "@/components/public/media";
import { ROUTES } from "@/lib/constants";
import { getProgrammePlaceholder, resolveImageSrc } from "@/lib/public-images";
import { getProgrammeBySlug, getPublishedProgrammes } from "@/lib/data/content";
import { formatDate, cn } from "@/lib/utils";

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

const statusColors: Record<string, string> = {
  PLANNED: "bg-brand-navy text-brand-green",
  COMING_SOON: "bg-amber-500 text-white",
  OPEN: "bg-green-600 text-white",
  ONGOING: "bg-blue-600 text-white",
  COMPLETED: "bg-brand-navy/10 text-brand-navy",
};

export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params;
  const [programme, allProgrammes] = await Promise.all([
    getProgrammeBySlug(slug),
    getPublishedProgrammes(),
  ]);
  if (!programme) notFound();

  const image = resolveImageSrc(programme.featuredImage, getProgrammePlaceholder(programme.category));
  const related = allProgrammes.filter((p) => p.slug !== slug).slice(0, 3);

  const detailSections = [
    { label: "Objectives", content: programme.objectives },
    { label: "Who Is It For", content: programme.whoIsItFor },
    { label: "What to Expect", content: programme.expectations },
    { label: "Timeline", content: programme.timeline },
  ].filter((s) => s.content);

  return (
    <>
      <section className="relative overflow-hidden bg-brand-navy pb-8 pt-6 md:pb-12">
        <div className="container-brand">
          <Breadcrumbs
            items={[
              { label: "Programmes", href: ROUTES.programmes },
              { label: programme.title },
            ]}
            light
          />
          <div className="mt-6 grid items-end gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    statusColors[programme.status] ?? statusColors.PLANNED,
                  )}
                >
                  {statusLabels[programme.status] ?? programme.status}
                </span>
                {programme.format ? (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                    {programme.format}
                  </span>
                ) : null}
              </div>
              <h1 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {programme.title}
              </h1>
              <p className="mt-4 max-w-xl text-lg text-white/80">{programme.excerpt}</p>
            </div>
            <EditorialImage
              src={image.src}
              alt={programme.featuredImage ? programme.title : image.alt}
              rounded="2xl"
              aspect="video"
              priority
              className="shadow-brand-lg"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-brand">
          <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
            <div>
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

          {related.length > 0 && (
            <div className="mt-20 border-t border-brand-border pt-16">
              <SectionHeading
                eyebrow="Explore More"
                title="Related Programmes"
                description="Other leadership development programmes you may be interested in."
                align="left"
              />
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <ProgrammeCard key={p.id} programme={p} />
                ))}
              </div>
            </div>
          )}

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
