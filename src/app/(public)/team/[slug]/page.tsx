import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Linkedin, Mail, ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { RichTextRenderer } from "@/components/public/RichTextRenderer";
import { BreadcrumbSchemaFromPaths } from "@/components/public/StructuredData";
import { ROUTES } from "@/lib/constants";
import { getTeamMemberBySlug } from "@/lib/data/content";
import { buildDynamicMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

const PORTRAIT_POSITION: Record<string, string> = {
  "elizabeth-dansoa-osei": "object-[center_15%]",
  "stephen-awuah-pobi": "object-[center_20%]",
  "linda-ackah-mensah": "object-[center_18%]",
  "christabel-gyebuaa-mensah": "object-[center_12%]",
  "hollandswell-donkor": "object-[center_20%]",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);
  if (!member) return { title: "Team Member Not Found", robots: { index: false, follow: false } };

  return buildDynamicMetadata({
    title: member.fullName,
    description: `${member.fullName}${member.role ? ` — ${member.role}` : ""} at EduLead Network.`,
    path: ROUTES.teamMember(member.slug),
    image: member.profileImage,
  });
}

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);
  if (!member) notFound();

  const imagePosition = PORTRAIT_POSITION[member.slug] ?? "object-center";

  return (
    <>
      <BreadcrumbSchemaFromPaths
        crumbs={[
          { name: "Team", path: ROUTES.team },
          { name: member.fullName },
        ]}
      />

      <section className="section-padding">
        <div className="container-brand max-w-5xl">
          <Breadcrumbs
            items={[
              { label: "Team", href: ROUTES.team },
              { label: member.fullName },
            ]}
          />

          <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-brand-lg bg-brand-navy/5 shadow-brand">
              {member.profileImage ? (
                <Image
                  src={member.profileImage}
                  alt={`${member.fullName}${member.role ? `, ${member.role}` : ""} of EduLead Network`}
                  fill
                  priority
                  className={`object-cover ${imagePosition}`}
                  sizes="(max-width: 1024px) 100vw, 320px"
                />
              ) : null}
            </div>

            <div>
              <h1 className="font-display text-3xl font-bold text-brand-navy md:text-4xl">
                {member.fullName}
              </h1>
              {member.role ? (
                <p className="mt-2 text-lg font-semibold text-brand-green-dark">{member.role}</p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                {member.linkedinUrl ? (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary !px-4 !py-2 text-sm"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                ) : null}
                {member.showEmail && member.email ? (
                  <a href={`mailto:${member.email}`} className="btn-secondary !px-4 !py-2 text-sm">
                    <Mail className="h-4 w-4" /> Email
                  </a>
                ) : null}
              </div>

              <div className="prose-brand mt-8">
                <RichTextRenderer content={member.biography} />
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Link href={ROUTES.team} className="btn-secondary inline-flex">
              <ArrowLeft className="h-4 w-4" /> Back to Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
