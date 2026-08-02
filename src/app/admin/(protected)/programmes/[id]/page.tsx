import { PageHeader } from "@/components/admin/PageHeader";
import { ProgrammeForm } from "@/components/admin/ProgrammeForm";
import { getProgramme } from "@/lib/actions/admin/programmes";
import { ROUTES } from "@/lib/constants";
import { notFound } from "next/navigation";

export default async function AdminProgrammeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const programme = isNew ? null : await getProgramme(id);
  if (!isNew && !programme) notFound();
  return (
    <div>
      <PageHeader title={isNew ? "New Programme" : "Edit Programme"} breadcrumbs={[{ title: "Programmes", href: ROUTES.admin.programmes }, { title: isNew ? "New" : programme!.title }]} />
      <ProgrammeForm programme={programme} />
    </div>
  );
}
