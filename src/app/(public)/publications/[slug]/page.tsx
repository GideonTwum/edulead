import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Download } from "lucide-react";
import { RichTextRenderer } from "@/components/public/RichTextRenderer";
import { ShareButtons } from "@/components/public/ShareButtons";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { PublicationRelatedLinks } from "@/components/public/PublicationRelatedLinks";
import { ArticleSchema, BreadcrumbSchemaFromPaths } from "@/components/public/StructuredData";
import { ROUTES } from "@/lib/constants";
import { getArticleBySlug } from "@/lib/data/content";
import { absoluteUrl, buildDynamicMetadata, SEO } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Publication Not Found", robots: { index: false, follow: false } };

  return buildDynamicMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    path: ROUTES.publication(article.slug),
    image: article.featuredImage,
    type: "article",
    publishedTime: article.publishedAt?.toISOString(),
    modifiedTime: article.updatedAt.toISOString(),
    author: article.authorName ?? SEO.siteName,
  });
}

export default async function PublicationDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const category = article.categoryLabel ?? article.category?.name;
  const shareUrl = absoluteUrl(ROUTES.publication(article.slug));
  const author = article.authorName ?? SEO.siteName;

  return (
    <>
      <ArticleSchema
        title={article.title}
        description={article.seoDescription ?? article.excerpt}
        image={article.featuredImage}
        datePublished={(article.publishedAt ?? article.createdAt).toISOString()}
        dateModified={article.updatedAt.toISOString()}
        author={author}
        url={shareUrl}
      />
      <BreadcrumbSchemaFromPaths
        crumbs={[
          { name: "Publications", path: ROUTES.publications },
          { name: article.title },
        ]}
      />

      <article className="section-padding">
        <div className="container-brand max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Publications", href: ROUTES.publications },
              { label: article.title },
            ]}
          />

          <h1 className="font-display text-3xl font-bold text-brand-navy md:text-4xl">{article.title}</h1>
          <p className="mt-4 text-lg text-brand-grey">{article.excerpt}</p>

          <div className="mb-8 mt-6 flex flex-wrap items-center gap-4 text-sm text-brand-grey">
            {category && (
              <span className="rounded-full bg-brand-off-white px-3 py-1 text-xs font-semibold text-brand-navy">
                {category}
              </span>
            )}
            {article.publishedAt && (
              <time dateTime={article.publishedAt.toISOString()}>{formatDate(article.publishedAt)}</time>
            )}
            {article.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {article.readingTime} min read
              </span>
            )}
            {article.authorName && <span>By {article.authorName}</span>}
          </div>

          {article.featuredImage && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-brand-lg">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          <RichTextRenderer content={article.content} />

          {article.downloadableFile && (
            <div className="mt-10">
              <a href={article.downloadableFile} download className="btn-secondary">
                <Download className="h-4 w-4" /> Download Publication
              </a>
            </div>
          )}

          <PublicationRelatedLinks category={category} />

          <ShareButtons url={shareUrl} title={article.title} className="mt-10 border-t border-brand-border pt-8" />

          <div className="mt-10 text-center">
            <Link href={ROUTES.publications} className="btn-secondary">
              ← Back to Publications
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
