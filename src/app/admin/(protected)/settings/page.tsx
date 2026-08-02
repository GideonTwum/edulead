import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSiteSettingsAdmin } from "@/lib/actions/admin/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsAdmin();
  return (
    <div>
      <PageHeader title="Site Settings" description="Configure organisation details, contact info, and site-wide options" />
      <SettingsForm settings={settings} />
    </div>
  );
}
