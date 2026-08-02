import { PageHeader } from "@/components/admin/PageHeader";
import { PageContentEditor } from "@/components/admin/PageContentEditor";
import { getPageContents } from "@/lib/actions/admin/pages";

export default async function AdminPagesPage() {
  const sections = await getPageContents();
  return (
    <div>
      <PageHeader title="Page Content" description="Edit content sections for public pages" />
      <PageContentEditor sections={sections} />
    </div>
  );
}
