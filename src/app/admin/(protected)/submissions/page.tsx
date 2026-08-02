import { PageHeader } from "@/components/admin/PageHeader";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { getJoinSubmissions } from "@/lib/actions/admin/submissions";

export default async function AdminSubmissionsPage() {
  const submissions = await getJoinSubmissions();
  return (
    <div>
      <PageHeader title="Join Submissions" description="Review applications from young people, mentors, volunteers, and partners" />
      <SubmissionsTable submissions={submissions} />
    </div>
  );
}
