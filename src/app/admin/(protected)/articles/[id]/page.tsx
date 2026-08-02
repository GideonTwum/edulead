import { PageHeader } from "@/components/admin/PageHeader";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { getArticle, getArticleCategories } from "@/lib/actions/admin/articles";
import { ROUTES } from "@/lib/constants";
import { notFound } from "next/navigation";

export default async function AdminArticleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const [article, categories] = await Promise.all([isNew ? null : getArticle(id), getArticleCategories()]);
  if (!isNew && !article) notFound();
  return (
    <div>
      <PageHeader title={isNew ? "New Article" : "Edit Article"} breadcrumbs={[{ title: "Articles", href: ROUTES.admin.articles }, { title: isNew ? "New" : article!.title }]} />
      <ArticleForm article={article} categories={categories} />
    </div>
  );
}
