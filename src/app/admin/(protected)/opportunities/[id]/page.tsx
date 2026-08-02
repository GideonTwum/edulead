import { PageHeader } from "@/components/admin/PageHeader";
import { OpportunityForm } from "@/components/admin/OpportunityForm";
import { getOpportunity } from "@/lib/actions/admin/opportunities";
import { ROUTES } from "@/lib/constants";
import { notFound } from "next/navigation";

export default async function AdminOpportunityEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const opportunity = isNew ? null : await getOpportunity(id);
  if (!isNew && !opportunity) notFound();
  return (
    <div>
      <PageHeader title={isNew ? "New Opportunity" : "Edit Opportunity"} breadcrumbs={[{ title: "Opportunities", href: ROUTES.admin.opportunities }, { title: isNew ? "New" : opportunity!.title }]} />
      <OpportunityForm opportunity={opportunity} />
    </div>
  );
}
