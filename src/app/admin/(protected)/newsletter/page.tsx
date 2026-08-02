import { PageHeader } from "@/components/admin/PageHeader";
import { NewsletterTable } from "@/components/admin/NewsletterTable";
import { getNewsletterSubscribers } from "@/lib/actions/admin/newsletter";

export default async function AdminNewsletterPage() {
  const subscribers = await getNewsletterSubscribers();
  return (
    <div>
      <PageHeader title="Newsletter" description="Manage newsletter subscribers and export lists" />
      <NewsletterTable subscribers={subscribers} />
    </div>
  );
}
