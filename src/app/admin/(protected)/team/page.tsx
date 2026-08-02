import { PageHeader } from "@/components/admin/PageHeader";
import { TeamManager } from "@/components/admin/TeamManager";
import { getTeamMembers } from "@/lib/actions/admin/team";

export default async function AdminTeamPage() {
  const members = await getTeamMembers();
  return (
    <div>
      <PageHeader title="Team" description="Manage team member profiles displayed on the public site" />
      <TeamManager members={members} />
    </div>
  );
}
